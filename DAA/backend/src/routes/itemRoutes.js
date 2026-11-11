const express = require("express");
const router = express.Router();
const { createItem, getAllItems } = require("../controllers/itemControllers");

//Post request to register E-Waste Item
router.post("/", createItem);

//Get request to get all the registered items
router.get("/", getAllItems);

module.exports = router;
