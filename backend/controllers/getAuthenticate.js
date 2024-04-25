const axios = require("axios");
const asyncHandler = require("express-async-handler");

// @desc    Check if user is part of the Discord group
// @route   GET /api/authenticate
const getAuthenticate = asyncHandler(async (req, res) => {
	console.log("GET /api/authenticate", new Date().toLocaleString());
	const accessToken = req.headers.authorization?.split(" ")[1];

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
	if (!userGuilds) return res.status(200).json({ error: "User is not part of the Discord group" });

	// Check if user is on the correct guild
	const isMember = userGuilds.some((guild) => guild.id === process.env.GUILD_ID);
	if (!isMember) return res.status(200).json({ error: "User is not part of the Discord group" });
	return res.status(200).json({ success: true });
});

module.exports = getAuthenticate;
