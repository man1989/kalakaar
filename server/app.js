const config = require("./config")();
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-body");
const mongoose = require("mongoose");
const albumRouter = require("./routes/albums");
const photoRouter = require("./routes/photos");

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
app.use(bodyParser({multipart: true}));
router.get("/", async(ctx, next)=>{
    ctx.body="Currently in development";
    ctx.status=200;
});
router.use(albumRouter.routes());
router.use(photoRouter.routes());
app.use(router.routes());
app.listen(config.PORT);