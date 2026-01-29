
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.connection_string;
        
        // Safety check to prevent the "undefined" error
        if (!uri) {
            throw new Error("MONGO_URI is not defined in .env file");
        }

        await mongoose.connect(uri);
        console.log("MongoDB Connected successfully");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;