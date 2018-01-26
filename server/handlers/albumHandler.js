const Album = require("../models/Album");

let listAlbums = async (ctx, next)=>{
    try{
        let albums = await Album.find();
        ctx.body = albums;
        ctx.status = 200;
        if(!albums.length){
            throw new Error("It seems you haven't created one");
        }
    }catch(err){
        ctx.body = err.message;
        ctx.status = 404;
    }
};

let createAlbum = async (ctx, next) => {
    try{
        let newAlbum = new Album(ctx.request.body);
        let res = await newAlbum.save();
        ctx.status = 201;
        ctx.body = newAlbum;
    }catch(err){
        ctx.body = "Failed to create";
        ctx.status = 500;
    }
};

let fetchAlbumById = async (ctx, next) => {
    try{
        let { id } = ctx.params;
        let data = await Album.findById({ _id: id });
        ctx.body = data;
        ctx.status = 200;
        if(!data){
            throw new Error("Album not found");
        }
    }catch(err){
        ctx.body = err.message;
        ctx.status = 404;
    }
};

let fetchAlbumByName = async (ctx, next) => {
    try{
        let { name } = ctx.params;
        let data = await Album.findOne({ name: name });
        ctx.body = data;
        ctx.status = 200;
        if(!data){
            throw new Error("Album not found");
        }
    }catch(err){
        ctx.body = err.message;
        ctx.status = 404;
    }
};

let updateAlbum = async (ctx, next) => {
    try{
        let { id } = ctx.params;
        let data = await Album.findById(id);
        Object.keys(ctx.request.body).forEach((key) => {
            data[key] = ctx.request.body[key];
        });
        await data.update(data);
        ctx.status = 204;
    }catch(err){
        ctx.body = "Fail to update";
        ctx.status = 404;
    }
};

module.exports = {
    listAll: listAlbums,
    fetchAlbumById: fetchAlbumById,
    fetchAlbumByName: fetchAlbumByName,
    updateAlbum: updateAlbum,
    createAlbum: createAlbum
}