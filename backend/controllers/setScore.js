const asyncHandler = require("express-async-handler");
const CryptoJS = require("crypto-js");
const Score = require("../models/scoreModel");
const { dcSendHighscore } = require("../discord/index");

// @desc    Set new score for user
// @route   POST /api/addScore
const setScore = asyncHandler(async (req, res) => {
	// Decrypt received score
	const bytes = CryptoJS.AES.decrypt(req.body.score, process.env.CRYPTOPASS);
	const parsedRequest = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

	// Validate password
	if (parsedRequest?.crypto !== process.env.CRYPTOWORD)
		return res.status(500).json({ message: "Error, wrong password" });

	const { id, name, avatar, score, correct, highestStreak, time, timePerQ, pageExits } =
		parsedRequest;
	let oldScore = -1;

	try {
		const filter = { id };
		const update = {
			$max: { score },
			name,
			avatar,
			correct,
			highestStreak,
			time,
			timePerQ,
			pageExits,
		};
		const options = { upsert: true, new: true }; // Creates a new object if user doesn't exist

		// If user has score already, save it as oldScore
		const existingScore = await Score.findOne(filter);
		if (existingScore) oldScore = existingScore.score;

		// Get current scoreboard
		const scoreboard = await Score.find();
		const maxValue = Math.max(...scoreboard.map((e) => e.score));

		// Update user score
		const updatedScore = await Score.findOneAndUpdate(filter, update, options);

		// RESPONSE
		if (updatedScore === null) {
			// The user had no previous score
			console.log("New score added:", updatedScore?.name, score);
			// New highscore
			if (score > maxValue) {
				dcSendHighscore(id, score, correct, highestStreak, time, timePerQ);
				res.status(202).json(updatedScore);
			} else res.status(201).json(updatedScore); // Normal score updated
		} else {
			if (oldScore >= score) {
				// The score was not updated because the new score is not higher than the previous score
				console.log("Score not updated:", updatedScore?.name, score);
				res.status(204).json(updatedScore);
			} else {
				// The score was updated successfully
				console.log("Score updated:", updatedScore?.name, score);

				// New highscore
				if (score > maxValue) {
					dcSendHighscore(id, score, correct, highestStreak, time, timePerQ);
					res.status(202).json(updatedScore);
				} else res.status(200).json(updatedScore); // Normal score updated
			}
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error updating score" });
	}
});

module.exports = setScore;
