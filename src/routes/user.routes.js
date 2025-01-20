const { Router } = require("express");
const { authorizeRole, verifyToken } = require("../middleware/auth");
const {
  getUsers,
} = require("../controllers/user_controllers/get_users.controller");

const userRouter = Router();

userRouter.get("/user", verifyToken, authorizeRole("ADMIN"), getUsers);

module.exports = userRouter;
