var mongoose = require("mongoose");

var optionSchema = new mongoose.Schema({
    name: String,
    votes: {type: Number, default: 0}
});

module.exports = mongoose.model("Option", optionSchema);