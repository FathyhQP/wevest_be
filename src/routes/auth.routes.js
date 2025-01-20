const { Router } = require("express");
const {
  validateUserInput,
} = require("../middleware/validators/user.validator");
const {
  register,
} = require("../controllers/auth_controllers/register.controller");
const { login } = require("../controllers/auth_controllers/login.controller");

const authRouter = Router();

authRouter.post("/register", validateUserInput, register);
authRouter.post("/login", login);

module.exports = authRouter;
