const Router = require("koa-router");
const userHandler = require("../handlers/userHandler");
let router = new Router();

router.post("/user", userHandler.createUser)
.get("/users", userHandler.listUsers);

module.exports = router;