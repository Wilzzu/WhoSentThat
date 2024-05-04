const express = require("express");
const session = require("express-session");
var cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const config = require("./config/config.json");

const connectDB = require("./utils/mongoose");
const getAuthenticate = require("./controllers/getAuthenticate");
const getQuestion = require("./controllers/getQuestion");
const getScoreboard = require("./controllers/getScoreboard");
const setScore = require("./controllers/setScore");

const app = express();
connectDB();

// Let our app use cors, json and urlencoded
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API endpoints
app.get("/api/scoreboard", getScoreboard);

// Validate the request has a token in the header
if (!config?.isDemo) {
	app.use(function (req, res, next) {
		if (!req.headers.authorization) return res.status(403).json({ error: "No credentials" });
		const accessToken = req.headers.authorization?.split(" ")[1];
		if (!accessToken || accessToken === "undefined" || accessToken === "null") {
			return res.status(403).json({ error: "No credentials" });
		}
		next();
	});
}

// Endpoints that require authentication
app.get("/api/authenticate", getAuthenticate);
app.get("/api/new", getQuestion);
app.post("/api/addScore", setScore);

app.listen(port, () => console.log(`Server started on port ${port}`.yellow));
