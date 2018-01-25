const mongoose = require("mongoose");
const AlbumSchema = mongoose.Schema({
    name: {
        type: String
    },
    tag:{
        type: String
    },
    parent_id: String,
    createDate: {type:Date, default: Date.now},
    modifiedDate: {type: Date, default: Date.now}
});
const Album = mongoose.model("Album", AlbumSchema);
module.exports = Album;