const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { randomUUID } = require("crypto");
const dotenv = require("dotenv").config();
const CryptoJS = require("crypto-js");
const config = require("../config/config.json");
const demoMembers = require("../config/demoMembers.json");
const { dcGetMembers, dcSendHighscore } = require("../discord");
const { default: axios } = require("axios");

const alreadyAuthorizedUsers = [];

// @desc    Get new question
// @route   GET /api/new
const getQuestion = asyncHandler(async (req, res) => {
	const accessToken = req?.headers?.authorization?.split(" ")[1];

	// Check if user is part of the Discord group
	if (!config?.isDemo) {
		let isAlreadyAuthorized = alreadyAuthorizedUsers.find((user) => user.token === accessToken);

		// Remove token from authorized users if it's older than 1 hour
		if (
			isAlreadyAuthorized &&
			new Date().getTime() - isAlreadyAuthorized.timestamp > 1000 * 60 * 60
		) {
			alreadyAuthorizedUsers.splice(alreadyAuthorizedUsers.indexOf(isAlreadyAuthorized), 1);
			isAlreadyAuthorized = null;
		}

		if (!isAlreadyAuthorized) {
			// Get user guilds
			const userGuilds = await axios
				.get("https://discord.com/api/users/@me/guilds", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res) => res.data)
				.catch((err) => {
					return null;
				});
			// Check if any guilds were found
			if (userGuilds === null || userGuilds === "error") {
				return res.status(404).json({ error: "Error fetching guilds" });
			}
			if (!userGuilds)
				return res.status(200).json({ error: "User is not part of the Discord group" });

			// Check if user is on the correct guild
			const isMember = userGuilds.some((guild) => guild.id === process.env.GUILD_ID);
			if (!isMember)
				return res.status(200).json({ error: "User is not part of the Discord group" });

			alreadyAuthorizedUsers.push({ token: accessToken, timestamp: new Date().getTime() });
		}
	}

	let files = [];
	let seed = Math.floor(Math.random() * 100);

	// 50% general messages (50% old chat logs, 50% new chat logs), 40% rare messages, 10% super rare messages
	if (seed <= config.messages.rarity.general) {
		if (seed < config.messages.rarity.general / config.messages.files.divideGeneralMessagesBy) {
			// 1 - number of old chat logs, here we have 2, so the range is from 1 to 2
			for (i = 1; i <= config.messages.files.oldAmount; i++) files.push("general" + i);
		} else {
			// Start this range from whatever the next number of chat logs would be, here it's 3, and end it at the last number of files
			// eg. If you have 3 old chat logs and 4 new chat logs, this range would be from 4 to 7
			for (
				i = config.messages.files.oldAmount + 1;
				i <= config.messages.files.oldAmount + config.messages.files.newAmount;
				i++
			)
				files.push("general" + i);
		}
	} else if (
		seed > config.messages.rarity.general &&
		seed <= config.messages.rarity.rare + config.messages.rarity.general
	) {
		files = config.messages.files.rare;
	}
	if (seed > config.messages.rarity.rare + config.messages.rarity.general) {
		files = config.messages.files.superRare;
	}

	const chosenFile = files[Math.floor(Math.random() * files.length)];
	// Read selected file and return question object
	fs.readFile(`../backend/database/${chosenFile}.json`, "utf8", (err, data) => {
		if (err) res.status(404);
		questionObject(JSON.parse(data), res);
	});
});

const randomizeRare = (choices, members, rareType) => {
	for (i = 0; i < 1; i++) {
		let randomize = Math.floor(Math.random() * rareType.length);
		let rare = members.find((e) => e.id === rareType[randomize]);
		if (rare) {
			rare.uuid = randomUUID();
			choices.push(rare);
		} else {
			choices.push({
				id: rareType[randomize],
				nickname: "Unknown",
				avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
				uuid: randomUUID(),
			});
		}
	}
};

// Get random message starting from the 3rd one, to leave space for 2 previous ones
const pickRandomMessage = (data) => {
	const messageSeed = Math.floor(Math.random() * (data.messageCount - 1 - 3)) + 2;
	const message = data.messages[messageSeed];
	const prevMsgs = [data.messages[messageSeed - 2], data.messages[messageSeed - 1]];

	return { message: message, prevMsgs: prevMsgs };
};

const questionObject = async (data, res) => {
	let randomMessage = pickRandomMessage(data);
	let tries = 0;

	// Keep picking a random message until it checks all the boxes
	while (
		(randomMessage.message.author.isBot ||
			((randomMessage.message.content.length < (config?.isDemo ? 1 : 25) ||
				randomMessage.message.content.split(" ").length <= 2) &&
				!randomMessage.message.embeds.length &&
				!randomMessage.message.attachments.length) ||
			(!randomMessage.prevMsgs[0].content.length &&
				!randomMessage.prevMsgs[0].embeds.length &&
				!randomMessage.prevMsgs[0].attachments.length) ||
			(!randomMessage.prevMsgs[1].content.length &&
				!randomMessage.prevMsgs[1].embeds.length &&
				!randomMessage.prevMsgs[1].attachments.length)) &&
		tries < 100
	) {
		randomMessage = pickRandomMessage(data);
		tries++;
	}

	const message = randomMessage.message,
		prevMsgs = randomMessage.prevMsgs;

	// Normally we would fetch the lates member name and icon so that it cannot be guessed by the old name or icon
	// For the demo purposes we will just use the values in the chat logs since they don't have real Discord member data
	const members = config?.isDemo ? demoMembers : await dcGetMembers();

	// Select who should be shown as choices, 3 normal chatters, 1 rare
	const choices = [];
	let tempNormal = [...config.chatters.normal];

	// Put correct one as first
	let correctMember = members.find((e) => e.id === message.author.id);
	if (correctMember) {
		correctMember.uuid = randomUUID();
		choices.push(correctMember);
	} else {
		message.author.uuid = randomUUID();
		message.author.avatar = "https://cdn.discordapp.com/embed/avatars/0.png";
		choices.push(message.author);
		correctMember = message.author;
	}

	// Logic for adding the rest of the choices
	// If correct is rare, add 3 normal ones
	if (
		config.chatters.rare.includes(correctMember.id) ||
		config.chatters.superRare.includes(correctMember.id)
	) {
		for (i = 0; i < 3; i++) {
			const randomChatter = Math.floor(Math.random() * tempNormal.length);
			let random = members.find((e) => e.id === tempNormal[randomChatter]);
			if (random) {
				random.uuid = randomUUID();
				choices.push(random);
			} else {
				choices.push({
					id: tempNormal[randomChatter],
					nickname: "Unknown",
					avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
					uuid: randomUUID(),
				});
			}
			tempNormal.splice(randomChatter, 1);
		}
	}
	// If correct is normal, add 1 rare 12% (25% chance for super rare instead) of the time and 2 normal ones
	else {
		let normalAmount = 3;
		let randomRare = Math.random();
		if (randomRare > 0.88) {
			if (randomRare >= 0.985) randomizeRare(choices, members, config.chatters.superRare);
			else randomizeRare(choices, members, config.chatters.rare);
			normalAmount = 2;
		}
		tempNormalFiltered = tempNormal.filter((e) => e !== message.author.id);
		for (i = 0; i < normalAmount; i++) {
			const randomChatter = Math.floor(Math.random() * tempNormalFiltered.length);
			let random = members.find((e) => e.id === tempNormalFiltered[randomChatter]);
			if (random) {
				random.uuid = randomUUID();
				choices.push(random);
			} else {
				choices.push({
					id: tempNormalFiltered[randomChatter],
					nickname: "Unknown",
					avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
					uuid: randomUUID(),
				});
			}
			tempNormalFiltered.splice(randomChatter, 1);
		}
	}

	// Lastly randomize the array
	// Array randomizer from https://stackoverflow.com/a/2450976
	let currentIndex = choices.length,
		randomIndex;
	// While there remain elements to shuffle.
	while (currentIndex !== 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[choices[currentIndex], choices[randomIndex]] = [choices[randomIndex], choices[currentIndex]];
	}

	// Create final object
	const finalObject = {
		question: {
			content: message.content,
			embeds: message.embeds,
			attachments: message.attachments,
			author: message.author,
			date: message.timestamp,
			channel: data.channel.name,
		},
		choices,
		previousMsgs: [
			{
				content: prevMsgs[0].content,
				embeds: prevMsgs[0].embeds,
				attachments: prevMsgs[0].attachments,
				author: prevMsgs[0].author,
				date: prevMsgs[0].timestamp,
			},
			{
				content: prevMsgs[1].content,
				embeds: prevMsgs[1].embeds,
				attachments: prevMsgs[1].attachments,
				author: prevMsgs[1].author,
				date: prevMsgs[1].timestamp,
			},
		],
	};

	// Return final object
	res.status(200).json(finalObject);
};

module.exports = getQuestion;
