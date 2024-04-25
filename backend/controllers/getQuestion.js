const fs = require("fs");
const asyncHandler = require("express-async-handler");
const { randomUUID } = require("crypto");
const dotenv = require("dotenv").config();
const CryptoJS = require("crypto-js");
const config = require("../config/config.json");
const demoMembers = require("../config/demoMembers.json");
// const { dcGetMembers, dcSendHighscore } = require("../discord");

// @desc    Get new question
// @route   GET /api/new
const getQuestion = asyncHandler(async (req, res) => {
	console.log("GET /api/new", new Date().toLocaleString());
	let files = [];
	let seed = Math.floor(Math.random() * 1000);

	// 84% general messages (65% old chat logs, 35% new chat logs), 12% 1st categories, 4% 2nd categories
	if (seed < 840) {
		if (seed < 546) {
			// 1 - number of old chat logs, here we only have 1, so the range is from 1 to 1
			for (i = 1; i <= 1; i++) files.push("general" + i);
		} else {
			// If you have more than 1 old chat log, start this range from whatever the next number is, here it's 2, and end it at the last number of files
			// eg. If you have 3 old chat logs and 4 new chat logs, this range would be from 4 to 7
			for (i = 2; i <= 2; i++) files.push("general" + i);
		}
	}
	// Other categories
	if (seed >= 840 && seed < 960) files = ["category1"];
	if (seed >= 960) files = ["category2"];

	const chosenFile = files[Math.floor(Math.random() * files.length)];
	// Read selected file and return question object
	fs.readFile(`../backend/database/${chosenFile}.json`, "utf8", (err, data) => {
		if (err) {
			console.log(err);
			res.status(404);
		}
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
			console.log("Didnt find rare id: " + rareType[randomize]);
			i = i - 1;
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

	// Keep picking a random message until it checks all the boxes
	// For the demo purposes we skip this check
	// while (
	// 	randomMessage.message.author.isBot ||
	// 	((randomMessage.message.content.length < 25 ||
	// 		randomMessage.message.content.split(" ").length <= 2) &&
	// 		!randomMessage.message.embeds.length &&
	// 		!randomMessage.message.attachments.length) ||
	// 	(!randomMessage.prevMsgs[0].content.length &&
	// 		!randomMessage.prevMsgs[0].embeds.length &&
	// 		!randomMessage.prevMsgs[0].attachments.length) ||
	// 	(!randomMessage.prevMsgs[1].content.length &&
	// 		!randomMessage.prevMsgs[1].embeds.length &&
	// 		!randomMessage.prevMsgs[1].attachments.length)
	// ) {
	// 	randomMessage = pickRandomMessage(data);
	// }

	const message = randomMessage.message,
		prevMsgs = randomMessage.prevMsgs;

	// Normally we would fetch the lates member name and icon so that it cannot be guessed by the old name or icon
	// const members = await dcGetMembers();

	// For the demo purposes we will just use the values in the chat logs since they don't have real Discord member data
	const members = demoMembers;

	// Select who should be shown as choices, 3 normal chatters, 1 rare
	const choices = [];
	let tempNormal = [...config.chatters.normalChatters];

	// Put correct one as first
	let correctMember = members.find((e) => e.id === message.author.id);
	if (correctMember) {
		correctMember.uuid = randomUUID();
		choices.push(correctMember);
	} else {
		console.log("Member not found: ", message.author);
		message.author.uuid = randomUUID();
		message.author.avatar = "https://cdn.discordapp.com/embed/avatars/0.png";
		choices.push(message.author);
		correctMember = message.author;
	}

	// Logic for adding the rest of the choices, we will be skipping this for the demo
	// Instead we will just add 3 random members
	const filteredChoices = members.filter((e) => e.id !== correctMember.id);
	for (i = 0; i < 3; i++) {
		const randomChatter = Math.floor(Math.random() * filteredChoices.length);
		let random = filteredChoices[randomChatter];
		random.uuid = randomUUID();
		choices.push(random);
		filteredChoices.splice(randomChatter, 1);
	}

	// If correct is rare, add 3 normal ones
	// if (
	// 	config.chatters.rareChatters.includes(correctMember.id) ||
	// 	config.chatters.superRareChatters.includes(correctMember.id)
	// ) {
	// 	for (i = 0; i < 3; i++) {
	// 		const randomChatter = Math.floor(Math.random() * tempNormal.length);
	// 		let random = members.find((e) => e.id === tempNormal[randomChatter]);
	// 		if (random) {
	// 			random.uuid = randomUUID();
	// 			choices.push(random);
	// 		} else {
	// 			console.log("Didnt find ID: " + tempNormal[randomChatter]);
	// 			i = i - 1;
	// 		}
	// 		tempNormal.splice(randomChatter, 1);
	// 	}
	// }
	// // If correct is normal, add 1 rare 12% (25% chance for super rare instead) of the time and 2 normal ones
	// else {
	// 	let normalAmount = 3;
	// 	let randomRare = Math.random();
	// 	if (randomRare > 0.88) {
	// 		if (randomRare >= 0.985) randomizeRare(choices, members, config.chatters.superRareChatters);
	// 		else randomizeRare(choices, members, config.chatters.rareChatters);
	// 		normalAmount = 2;
	// 	}
	// 	tempNormalFiltered = tempNormal.filter((e) => e !== message.author.id);
	// 	for (i = 0; i < normalAmount; i++) {
	// 		const randomChatter = Math.floor(Math.random() * tempNormalFiltered.length);
	// 		console.log(randomChatter, tempNormalFiltered[randomChatter]);
	// 		let random = members.find((e) => e.id === tempNormalFiltered[randomChatter]);
	// 		if (random) {
	// 			random.uuid = randomUUID();
	// 			choices.push(random);
	// 		} else {
	// 			console.log("Didnt find: " + tempNormalFiltered[randomChatter]);
	// 			i = i - 1;
	// 		}
	// 		tempNormalFiltered.splice(randomChatter, 1);
	// 	}
	// }

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
