const express = require("express");
const { handleGet } = require("../controllers/url");

const router = express.Router();

//Routes
router.get("/", handleGet);

module.exports = router;
