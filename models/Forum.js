const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/studentHub", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const forumSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    topic: {
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
});

const forumModel = mongoose.model("forum", forumSchema);

module.exports = forumModel