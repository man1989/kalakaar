const Album = require("../models/Album");
const Router = require("koa-router");
let router = new Router();

module.exports = router;

router.get("/albums", async (ctx, next)=>{
    try{
        let albums = await Album.find();
        ctx.body = albums;
    }catch(err){
        ctx.body = err;
        console.log("not found: ", err);
    }
});

router.post("/album", async (ctx, next)=>{
    let newAlbum =  new Album(ctx.request.body);
    let res = await newAlbum.save();
    ctx.status = 201;
    ctx.body = newAlbum;
}).get("/album/:id", async(ctx, next)=>{
    let {id} = ctx.params;
    let data = await Album.find({_id: id});
    ctx.body = data;
}).get("/album/name/:name", async (ctx, next)=>{
    let {name} = ctx.params;
    let data = await Album.find({name: name});
    ctx.body = data;    
}).patch("/album/:id", async (ctx, next)=>{
    let {id} = ctx.params;
    let data = await Album.findById(id);
    console.log(ctx.request.body);
    Object.keys(ctx.request.body).forEach((key)=>{
        data[key] = ctx.request.body[key];
    });
    await data.update(data);
    ctx.status = 204;
    ctx.body = "updated";
});