module.exports = async (ctx, next)=>{
    let overrideMethod = ctx.headers["x-http-method-override"];
    if(ctx.method === "POST" && overrideMethod){
        console.log("method override");
        ctx.method = overrideMethod;
    }    
    await next();
}