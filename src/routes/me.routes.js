const { Router } = require("express");
const { verifyToken } = require("../middleware/auth");
const { getMe } = require("../controllers/me/get_me.controller");
const { updateMe } = require("../controllers/me/update_me.controller");
const { deleteMe } = require("../controllers/me/delete_me.controller");

const meRouter = Router();

meRouter.get("/me", verifyToken, getMe);
meRouter.patch("/me", verifyToken, updateMe);
meRouter.delete("/me", verifyToken, deleteMe);


module.exports = meRouter;
