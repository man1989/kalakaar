const User = require("../models/User");
const jwt = require("jsonwebtoken");

let createUser = async (ctx, next)=>{
    let userObj = ctx.request.body;
    let isExists = await User.userExists(userObj);
    if(isExists){
       ctx.status = 409;
       ctx.body = {};
    }else{
        let user = new User(ctx.request.body);
        await user.save();
        ctx.status = 201;
        ctx.body = user;
    }
};

let userLogin = async(ctx, next)=>{
    let {username, password} = ctx.request.body;
    let secretKey = process.env.SECRET_KEY;    
    let token = jwt.sign({user: username}, secretKey, {expiresIn: 60*30});
    ctx.body = {
        tokenId:token 
    }
    ctx.status = 200;
}

let listUsers = async (ctx, body)=>{
    let users = await User.find();
    ctx.body = users;
    if(users.length){
        ctx.status = 200;    
    }else{
        ctx.status = 404;
    }
};

module.exports = {
    createUser: createUser,
    listUsers: listUsers,
    userLogin: userLogin
}