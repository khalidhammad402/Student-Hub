const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/studentHub", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const experienceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        unique: true,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    }
});

const experienceModel = mongoose.model("experience", experienceSchema);

module.exports = experienceModel