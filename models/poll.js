const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
    name: String,
    options: Array,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Poll", PollSchema);