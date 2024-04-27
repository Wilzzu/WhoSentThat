const mongoose = require("mongoose");

// Create new schema which will be used to create new entries to the DB
const scoreSchema = mongoose.Schema({
	id: {
		type: String,
		require: true,
	},
	name: {
		type: String,
		require: true,
	},
	avatar: {
		type: String,
		require: true,
	},
	score: {
		type: Number,
		require: true,
	},
	correct: {
		type: Number,
		require: true,
	},
	highStreak: {
		type: Number,
		require: true,
	},
	time: {
		type: String,
		require: true,
	},
	timePerQ: {
		type: Array,
		require: true,
	},
	pageExits: {
		type: Number,
		require: true,
	},
});

module.exports = mongoose.model("Score", scoreSchema);
