const Router = require("koa-router");
const photoController = require("../handlers/photoHandler");

let router = new Router();
router.post("/album/:id/photo", photoController.uploadImage);

router.get("/album/:id/photos", photoController.listImages);

module.exports = router;