const { Router } = require("express");
const { authorizeRole, verifyToken } = require("../middleware/auth");
const {
  getUsers,
} = require("../controllers/user_controllers/get_users.controller");
const {
  createUser,
} = require("../controllers/user_controllers/create_user.controller");
const {
  validateUserInput,
} = require("../middleware/validators/user.validator");
const { deleteUser } = require("../controllers/user_controllers/delete_user.controller");
const { updateUser } = require("../controllers/user_controllers/update_user.controller");
const { getUserDetail } = require("../controllers/user_controllers/get_user.controller");

const userRouter = Router();

userRouter.get("/user", verifyToken, authorizeRole("ADMIN"), getUsers);
userRouter.get(
  "/user/:user_code",
  verifyToken,
  authorizeRole("ADMIN"),
  getUserDetail
);
userRouter.post(
  "/user",
  verifyToken,
  authorizeRole("ADMIN"),
  validateUserInput,
  createUser
);
userRouter.patch(
  "/user/:user_code",
  verifyToken,
  validateUserInput,
  authorizeRole("ADMIN"),
  updateUser
);
userRouter.delete(
  "/user/:user_code",
  verifyToken,
  authorizeRole("ADMIN"),
  deleteUser
);

module.exports = userRouter;
