const albumHandler = require("../handlers/albumHandler");
const Router = require("koa-router");
let router = new Router();

router.get("/albums", albumHandler.listAll);

router.post("/album", albumHandler.createAlbum)
.get("/album/:id", albumHandler.fetchAlbumById)
.get("/album/name/:name",albumHandler.fetchAlbumByName)
.patch("/album/:id", albumHandler.updateAlbum)
.delete("/album/:id", albumHandler.deleteAlbum);

module.exports = router;