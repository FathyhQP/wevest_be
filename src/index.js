require("dotenv").config();
const express = require("express");
const appMiddleware = require("./middleware/");

const app = express();
const port = process.env.PORT != null ? parseInt(process.env.PORT) : 3001;

app.listen(port, '0.0.0.0',() => {
  console.log(`😁 Welcome to Server!`);
  console.log(`🚀 Listening on port ${port}`);
});

app.use(appMiddleware);
