const mongoose = require("mongoose");
const AlbumSchema = mongoose.Schema({
    name: {
        type: String
    },
    tag:{
        type: String
    },
    photos:[{
        name: String,
        location: String,
        tag: String,
        comments:[{}]
    }],
    createDate: {type:Date, default: Date.now},
    modifiedDate: {type: Date, default: Date.now}
});
const Album = mongoose.model("Album", AlbumSchema);
module.exports = Album;