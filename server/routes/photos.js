const Router = require("koa-router");
const util = require("util");

let {rename, stat, mkdir} = require("fs");
let router = new Router();
f_rename = util.promisify(rename);
f_stat = util.promisify(stat);
f_mkdir = util.promisify(mkdir);

router.post("/upload", async (ctx, next)=>{
    let {request} = ctx;
    let {files} = request.body;
    let {name} = files.imageFile;
    try{
        let filePath = await _helpers.getFilePath();
        await f_rename(files.imageFile.path, `${filePath}/${name}`);
        ctx.status = 201;
        ctx.body = "uploaded successfully";
    }catch(err){
        console.error(err);
        ctx.status = 404
    }
});

_helpers = {
    getFilePath: async function(){
        let filePath = `${__dirname}/../../photos`;
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