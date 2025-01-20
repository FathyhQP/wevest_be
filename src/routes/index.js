const { Router } = require("express");
const userRouter = require("./user.routes");
const authRouter = require("./auth.routes");
const appRouter = Router();

appRouter.use("/api", userRouter);
appRouter.use("/api/auth", authRouter);

module.exports = appRouter;
