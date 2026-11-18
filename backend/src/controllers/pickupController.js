const PickupRequest = require("../models/PickupRequest");

const createRequest = async (req, res) => {
  try {
    const { address, date, time, status } = req.body;
    if (!address || !time || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide address, date and time",
      });
    }
    const newRequest = new PickupRequest({
      address,
      date,
      time,
      status: status || "Pending",
    });
    const savedRequest = await newRequest.save();
    return res.status(201).json({
      success: true,
      message: "Pickup request created successfully",
      request: savedRequest,
    });
  } catch (error) {
    console.error("Pickup request error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating pickup request",
    });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await PickupRequest.find().sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      count: requests.length,
      requests: requests,
    });
  } catch (error) {
    console.error("Error fetching pickup requests:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pickup requests",
    });
  }
};

const updateRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowStatuses = ["Pending", "Scheduled", "Completed", "Cancelled"];
    if (!allowStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pickup status",
      });
    }
    const updatedRequest = await PickupRequest.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Pickup request not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Pickup status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating pickup status",
    });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await PickupRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: "Pickup request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pickup request deleted successfully",
      request: deletedRequest,
    });
  } catch (error) {
    console.error("Delete request error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting pickup request",
    });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  updateRequestDetails,
  deleteRequest,
};
