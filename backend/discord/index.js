const {
	Client,
	Events,
	GatewayIntentBits,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
} = require("discord.js");
require("dotenv").config();
const colors = require("colors");

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// When the Discord bot comes online
client.once(Events.ClientReady, async (e) => {
	console.log(`Discord bot online! Logged in as ${e.user.tag}`.blue);
	await dcGetMembers(true);
});

// Global values
let membersData = null;
let refreshRate = 86400000; //1 day: 86400000, 10 sec: 10000
let lastUpdate = 0;

// Add button that redirects to the correct website
const addBtn = (label, url, emoji) => {
	return new ActionRowBuilder().addComponents(
		new ButtonBuilder().setLabel(label).setURL(url).setStyle("Link").setEmoji(emoji)
	);
};

// Get members and voice channel members
const dcGetMembers = async (force = false) => {
	// If last update was under 24 hours ago, return old data
	if (!shouldUpdate() && !force) {
		console.log("Latest member update was under 24 hours ago, serving old data".yellow);
		return membersData;
	}

	// Else check for fetch new data
	let members = await client.guilds.cache
		?.find((g) => g.id === process.env.GUILD_ID)
		?.members?.fetch();

	try {
		let allMembers = [];
		members.forEach((e) => {
			if (!e.user.bot) {
				let user = {
					nickname: e.nickname ? e.nickname : e.user.username,
					username: e.user.username,
					avatar: e.user.displayAvatarURL(),
					id: e.user.id,
				};
				allMembers.push(user);
			}
		});
		console.log(`Updated members list with ${allMembers.length} members`.green);
		membersData = allMembers;
		return allMembers;
	} catch (error) {
		console.log(error);
	}
};

const formatTime = (time, addPadding) => {
	const date = new Date(time);
	const min = date.getUTCMinutes();
	let sec = date.getUTCSeconds();
	const hour = date.getUTCHours();
	if (sec < 10 && addPadding) sec = sec.toString().padStart(2, "0");

	return `${hour > 0 ? hour + "h " : ""}${min > 0 ? min + "m " : ""}${sec}s`;
};

// Add padding to text depending on the length
const formatText = (val, amount) => {
	const padding = amount - val.toString().length;
	const first = Math.floor(padding / 2);
	const second = padding - first;

	return `${" ".repeat(first)}${val}${" ".repeat(second)}`;
};

// Handle sending Who highscore notification
const createHighscoreEmbed = async (user, score, correct, highStreak, time, timePerQ) => {
	const unix = Math.floor(Date.now() / 1000);
	const allUsers = await dcGetMembers();
	const findUser = allUsers?.find((members) => user === members.id);
	const finalTime = formatTime(time, true);
	let finalAvg = "";

	// Calculate avg time
	const avgTime = Math.ceil(timePerQ.reduce((a, b) => a + b, 0) / timePerQ.length);
	if (avgTime >= 1000) finalAvg = "~" + formatTime(avgTime);
	else finalAvg = "~" + avgTime + "ms";

	// Create embed
	const highscoreEmbed = new EmbedBuilder()
		.setColor("#fcba03")
		.setURL(process.env.WEBSITE_URL)
		.setTitle(`${findUser?.nickname} set a new highscore!`)
		.setDescription(
			`# Pisteet: ${score}\n` +
				"```prolog\nCorrect   Streak    Time    Time/Question\n" +
				`${formatText(correct, 7)}   ${formatText(highStreak, 6)}${formatText(
					finalTime,
					13
				)}${formatText(finalAvg, 13)} ` +
				"\n```\n" +
				`<t:${unix}:R>`
		)
		.setThumbnail(findUser?.avatar);

	return highscoreEmbed;
};

const dcSendHighscore = async (user, score, correct, highStreak, time, timePerQ) => {
	console.log(user, score, correct, highStreak, time, timePerQ);
	client.channels.cache.get(process.env.CHANNEL_ID).send({
		embeds: [await createHighscoreEmbed(user, score, correct, highStreak, time, timePerQ)],
		components: [addBtn("Leaderboard", process.env.WEBSITE_URL, "🥇")],
	});
};

// Check if latest update was over 24 hours ago
const shouldUpdate = () => {
	if (Date.now() > lastUpdate + refreshRate) {
		lastUpdate = Date.now();
		return true;
	} else return false;
};

// Log the bot into Discord
client.login(process.env.DC_TOKEN);

// Export functions
module.exports = {
	dcGetMembers,
	dcSendHighscore,
};
