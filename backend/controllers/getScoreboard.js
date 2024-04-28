const Score = require("../models/scoreModel");
const asyncHandler = require("express-async-handler");

// @desc    Get scoreboard
// @route   GET /api/scoreboard
const getScoreboard = asyncHandler(async (req, res) => {
	console.log("GET /api/scoreboard", new Date().toLocaleString());
	const scoreboard = await Score.find();
	res.status(200).json(scoreboard);
});

module.exports = getScoreboard;
