const jwt = require("jsonwebtoken");
const User = require("../models/User");
let skipRoutes
module.exports = function(){
    return async (ctx, next)=>{
        try{
            let {username, password} = ctx.headers;
            let {authorization} = ctx.headers;
            if(!authorization) throw new Error("Not Authorized");
            let token = authorization.split(" ")[1];
            let secretKey = process.env.SECRET_KEY; ;            
            let result = jwt.verify(token, secretKey);
            ctx.status=200;
            return next();
        }catch(err){
            console.error(err);
            ctx.status = 401;
        }
    };
}