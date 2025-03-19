const { Router } = require("express");
const userRouter = require("./user.routes");
const authRouter = require("./auth.routes");
const meRouter = require("./me.routes");
const appRouter = Router();

appRouter.use("/api", userRouter);
appRouter.use("/api", meRouter);
appRouter.use("/api/auth", authRouter);

module.exports = appRouter;
