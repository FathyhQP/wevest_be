const { Router } = require("express");
const { authorizeRole, verifyToken } = require("../middleware/auth");
const {
  getUsers,
} = require("../controllers/user_controllers/get_users.controller");
const { createUser } = require("../controllers/user_controllers/create_user.controller");
const { validateUserInput } = require("../middleware/validators/user.validator");

const userRouter = Router();

userRouter.get("/user", verifyToken, authorizeRole("ADMIN"), getUsers);
userRouter.post("/user", verifyToken, authorizeRole("ADMIN"), validateUserInput, createUser);

module.exports = userRouter;
