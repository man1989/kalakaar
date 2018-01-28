User = require("../models/User");

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
    listUsers: listUsers
}