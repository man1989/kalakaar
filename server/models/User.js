const crypto = require("crypto");
const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    salt: String,
    date: {
        type: Date, default: Date.now
    }
});

let getHashPassword = function(password, salt){
    let hashCode = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return {
        password: hashCode,
        salt: salt
    };
};

let getSalt = function(){
    return crypto.randomBytes(10).toString("hex");
};

userSchema.methods.hasValidPassword = function(password){
    let {password: savedPassword, salt} = this;
    let hashObj = getHashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(hashObj.password), Buffer.from(savedPassword));
};

userSchema.statics.userExists = async function (user){
    let {username} = user;
    return !! await this.findOne({username: username});
}

userSchema.pre("save", function(next, salt){
    let {username, password} = this;
    let hashObj = getHashPassword(password, getSalt());
    Object.assign(this, hashObj);
    next();
});

module.exports = mongoose.model("users", userSchema);