const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

// Connect to database
const connectDB = async () => {
	try {
		const uri = `${process.env.MONGODB_URI}?retryWrites=true&w=majority`;
		const conn = await mongoose.connect(uri);

		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

module.exports = connectDB;
