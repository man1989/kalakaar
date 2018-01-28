const config = require("./config")();
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-body");
const mongoose = require("mongoose");
const albumRouter = require("./routes/albums");
const photoRouter = require("./routes/photos");
const userRouter = require("./routes/users");

mongoose.connect(config.MONGODB_URI);
let conn = mongoose.connection;
conn.on("error", function(err){
    console.error("fail to connect");
});
conn.on("open", function(err){
    console.error("connected to mongodb");
});

let app = new Koa();
let router = new Router();

app.use(async (ctx, next)=>{
    let overrideMethod = ctx.headers["x-http-method-override"];
    if(ctx.method === "POST" && overrideMethod){
        console.log("method override");
        ctx.method = overrideMethod;
    }    
    await next();
});

app.use(bodyParser({multipart: true}));

router.get("/", async(ctx, next)=>{
    ctx.body="Currently in development";
    ctx.status=200;
})
.use(albumRouter.routes())
.use(photoRouter.routes())
.use(userRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.PORT);