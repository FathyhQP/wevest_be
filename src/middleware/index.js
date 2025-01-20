const express = require("express");
const cors = require("cors");
const appRouter = require("../routes");
const bodyParser = require("body-parser");

const appMiddleware = express();

appMiddleware.use(
  cors({
    origin: "*",
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

appMiddleware.options("*", cors());
appMiddleware.use(bodyParser.json());
appMiddleware.use(bodyParser.urlencoded({ extended: true }));
appMiddleware.use(express.static("public"));
appMiddleware.use(appRouter);

module.exports = appMiddleware;
