const { Router } = require("express");
const userRouter = require("./user.routes");
const authRouter = require("./auth.routes");
const meRouter = require("./me.routes");
const digitalProductRouter = require("./digital_product.routes");
const appRouter = Router();

appRouter.use("/api", userRouter);
appRouter.use("/api", meRouter);
appRouter.use("/api/auth", authRouter);
appRouter.use("/api", digitalProductRouter);

module.exports = appRouter;
