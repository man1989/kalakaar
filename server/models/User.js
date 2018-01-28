const mongoose = require("mongoose");
let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    date: {
        type: Date, default: Date.now
    }
});
userSchema.statics.userExists = async function (user){
    let {username} = user;
    return !! await this.findOne({username: username});
}
module.exports = mongoose.model("users", userSchema);