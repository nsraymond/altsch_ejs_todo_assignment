const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

// connect to db
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.log("Error connecting to MongoDB");
        console.error(err);
    }
}

module.exports = {
    connectToMongoDB
}
