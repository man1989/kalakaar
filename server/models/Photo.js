const mongoose = require("mongoose");
let {Schema, Model} = mongoose
let PhotoSchema = new Schema({
    album_id: String,
    name: String,
    tag: String,
    location: String,
    date: {
        type: Date, default: Date.now
    }
});
module.exports = mongoose.model("photos", PhotoSchema);

