const express = require("express");

const urlRoute = require("./src/routes/url");
const app = express();

const PORT = 8000;

app.use(express.json());

//Routes

app.use("/api/url", urlRoute);

app.listen(PORT, () => {
  console.log(`The server has started at ${PORT}`);
});
