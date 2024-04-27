const express = require("express");
const session = require("express-session");
var cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;

const connectDB = require("./utils/mongoose");
const getAuthenticate = require("./controllers/getAuthenticate");
const getQuestion = require("./controllers/getQuestion");
const getScoreboard = require("./controllers/getScoreboard");

const app = express();
connectDB();

// Let our app use cors, json and urlencoded
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DISABLED FOR DEMO
// Validate the request has a token in the header
// app.use(function (req, res, next) {
// 	if (!req.headers.authorization) return res.status(403).json({ error: "No credentials" });
// 	const accessToken = req.headers.authorization?.split(" ")[1];
// 	if (!accessToken || accessToken === "undefined" || accessToken === "null") {
// 		return res.status(403).json({ error: "No credentials" });
// 	}
// 	next();
// });

// API endpoints
app.get("/api/authenticate", getAuthenticate);
app.get("/api/new", getQuestion);
app.get("/api/scoreboard", getScoreboard);
// app.post("/api/addScore", setWhoScore);

app.listen(port, () => console.log(`Server started on port ${port}`.yellow));
