const config = require("./config")();
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const albumRouter = require("./routes/albums");

mongoose.connect(config.MONGODB_URI);
let conn = mongoose.connection;
conn.on("error", function(err){
    console.error("fail to connect");
});
conn.on("open", function(err){
    console.error("connected to mongodb");
});

let app = new Koa();
let router = new Router({
    prefix: "/api/v1"
});

router.use(albumRouter.routes());
app.use(bodyParser());
app.use(router.routes());
app.listen(config.PORT);