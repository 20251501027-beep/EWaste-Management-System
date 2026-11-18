require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

const urlRoute = require("./src/routes/url");
const itemRoutes = require("./src/routes/itemRoutes");
const pickupRoutes = require("./src/routes/pickupRoutes");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

// Allow the React dev-server (port 5173) and any localhost origin to reach the API
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || origin.startsWith("http://localhost")) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

//Routes

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Waste Management system backend is working",
  });
});

app.use("/api/url", urlRoute);
app.use("/api/items", itemRoutes);
app.use("/api/requests", pickupRoutes);

// Start the server after database connection

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`The server has started at ${PORT}`);
  });
};

startServer();
