require("dotenv").config();
const express = require("express");
const appMiddleware = require("./middleware/");

const app = express();
const port = process.env.PORT != null ? parseInt(process.env.PORT) : 3001;

app.listen(port, 3000, '0.0.0.0', () => {
  console.log(`😁 Welcome to Server!`);
  console.log(`Server running on http://0.0.0.0:3000`);
  console.log(`🚀 Listening on port ${port}`);
});

app.use(appMiddleware);
