const util = require("util");
const { rename } = require("fs");
const f_helper = require("../helpers/file");
const Photo = require("../models/Photo")
let f_rename = util.promisify(rename);

let saveToDB = async (ctx, dirPath) => {
    let { request, params} = ctx;
    let { files } = request.body || {};
    let { name } = files.imageFile;
    let photo = new Photo({
        album_id: params.id,
        name: name,
        location: `${dirPath}/${name}`
    });
    await photo.save();
    return photo;
}

let uploadImage = async (ctx, next) => {
    let { request, params } = ctx;
    let { files = {}} = request.body || {};
    let { name, path: tempPath } = files.imageFile || {};
    try {
        if(!tempPath) throw new Error("no file specified");
        let dirPath = await f_helper.obtainDirectory(__dirname, "../../photos");
        await f_rename(tempPath, `${dirPath}/${name}`);
        let photo = await saveToDB(ctx, dirPath);
        ctx.body = photo;
        ctx.status = 201;
    } catch (err) {
        console.error(err);
        ctx.status = 500;
    }
}

let listImages = async (ctx, next) => {
    let {id: album_id} = ctx.params;
    let photos = await Photo.find({album_id: album_id});
    ctx.body = photos;
};

module.exports = {
    uploadImage: uploadImage,
    listImages: listImages
}