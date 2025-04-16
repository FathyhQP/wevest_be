const express = require("express");
const cors = require("cors");
const appRouter = require("../routes");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const appMiddleware = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://203.194.114.83",
  "http://localhost:5175",
  "http://localhost:3000",
  "https://203.194.114.83",
  "https://wevest.id",
  "https://wevest-react.vercel.app",
];

// appMiddleware.use(
//   cors({
//     origin: function (origin, callback) {

//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         return callback(null, true);
//       }
//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true,
//     preflightContinue: false,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   })
// );

appMiddleware.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
  })
);

appMiddleware.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

appMiddleware.use(bodyParser.json());
appMiddleware.use(bodyParser.urlencoded({ extended: true }));
appMiddleware.use(express.json());
appMiddleware.use(express.urlencoded({ extended: true }));
appMiddleware.use(fileUpload());
appMiddleware.use(express.static("public"));
appMiddleware.use(appRouter);

module.exports = appMiddleware;
