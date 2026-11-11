const express = require("express");
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  updateRequestDetails,
  deleteRequest,
} = require("../controllers/pickupController");
router.post("/", createRequest);

router.get("/", getAllRequests);

router.patch("/:id/status", updateRequestDetails);

router.delete("/:id", deleteRequest);

module.exports = router;
