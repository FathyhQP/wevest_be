require("dotenv").config();
const express = require("express");
const appMiddleware = require("./middleware/");

const app = express();
const port = process.env.PORT != null ? parseInt(process.env.PORT) : 3001;

app.use(appMiddleware);

app.listen(port, 3000, '0.0.0.0', () => {
  console.log(`😁 Welcome to Server!`);
  console.log(`🚀 Listening on port ${port}`);
});


