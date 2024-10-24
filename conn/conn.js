const mongoose = require("mongoose");

const conn = async () => {
    try {
        await mongoose.connect("mongodb+srv://avintrade:avintrade57@cluster0.ozd9re0.mongodb.net/contact", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connection error:", error);
    }
};

conn();
