const Album = require("../models/Album");

let listAlbums = async (ctx, next)=>{
    try{
        let albums = await Album.find();
        ctx.body = albums;
        ctx.status = 200;
        if(!albums.length){
            ctx.status = 404
        }
    }catch(err){
        console.error(err);
        ctx.status = 500;
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
        if(data){
            ctx.body = data;
            ctx.status = 200;    
        }else{
            ctx.body = {};
            ctx.status = 404;
    
        }
    }catch(err){
        console.error(err);
        ctx.status = 500;
    }
};

let fetchAlbumByName = async (ctx, next) => {
    try{
        let { name } = ctx.params;
        let data = await Album.findOne({ name: name });
        if(data){
            ctx.body = data;
            ctx.status = 200;
        }else{
            ctx.body = {};
            ctx.status = 404;
        }
    }catch(err){
        console.error(err);
        ctx.status = 500;
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

let deleteAlbum = async (ctx, next)=>{
    let {id} = ctx.params;
    await Album.remove({_id:id});
    ctx.status = 200;
}
module.exports = {
    listAll: listAlbums,
    fetchAlbumById: fetchAlbumById,
    fetchAlbumByName: fetchAlbumByName,
    updateAlbum: updateAlbum,
    createAlbum: createAlbum,
    deleteAlbum: deleteAlbum
}