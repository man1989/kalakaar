const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = function(){
    return async (ctx, next) => {
        try{
            let {username, password} = ctx.headers;
            let accessToken = ctx.headers["x-access-token"];
            if(!accessToken) throw new Error("Not Authorized");
            let secretKey = process.env.SECRET_KEY;
            let result = jwt.verify(accessToken, secretKey);
            ctx.status=200;
            return next();
        }catch(err){
            console.error(err);
            ctx.status = 401;
        }
    };
}