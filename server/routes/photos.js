const Photo = require("../models/Photo")
const Router = require("koa-router");
const util = require("util");
const path = require("path");

let {rename, stat, mkdir} = require("fs");
let router = new Router();

f_rename = util.promisify(rename);
f_stat   = util.promisify(stat);
f_mkdir  = util.promisify(mkdir);

router.post("/album/:id/photo/upload", async (ctx, next)=>{
    let {request, params} = ctx;
    let {files} = request.body;
    let {name} = files.imageFile;
    try{
        let filePath = await _helpers.getFilePath();
        await f_rename(files.imageFile.path, `${filePath}/${name}`);
        let photo = new Photo({
            album_id: params.id,
            name: name,
            location:`${filePath}/${name}`
        });
        await photo.save();
        ctx.status = 201;
        ctx.body = photo;
    }catch(err){
        console.error(err);
        ctx.status = 404
    }
}).get("/album/:id/photos", async (ctx, next) => {
    let {id: album_id} = ctx.params;
    let photos = await Photo.find({album_id: album_id});
    ctx.body = photos;
});

_helpers = {
    getFilePath: async function(){
        let filePath = path.resolve(__dirname, "../../photos");
        try{
            let stats = await f_stat(filePath);
        }
        catch(err){
            await f_mkdir(filePath);
        }
        return filePath;
    }
}

module.exports = router;