const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

// Connect to database
const connectDB = async () => {
	try {
		const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@whosentthat.3jekrnl.mongodb.net/?retryWrites=true&w=majority`;
		const conn = await mongoose.connect(uri);

		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

module.exports = connectDB;
