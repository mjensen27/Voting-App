const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
    name: String,
    options: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Option"
    }]
});

module.exports = mongoose.model("Poll", PollSchema);