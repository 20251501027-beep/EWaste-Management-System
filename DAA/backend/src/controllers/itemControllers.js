const EWasteItem = require("../models/EWasteItem");

const createItem = async (req, res) => {
  try {
    const {
      id,
      type,
      category,
      weight,
      brand,
      model,
      storage,
      ram,
      operatingSystem,
      batteryType,
      capacity,
      description,
    } = req.body;
    if (!id || !type || !category || !weight) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields ",
      });
    }
    const existingItem = await EWasteItem.findOne({
      itemCode: id,
    });
    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: "An item with this ID already exists",
      });
    }
    const newItem = new EWasteItem({
      itemCode: id,
      type,
      category,
      weight,
      brand,
      model,
      storage,
      ram,
      operatingSystem,
      batteryType,
      capacity,
      description,
    });
    const savedItem = await newItem.save();
    return res.status(201).json({
      success: true,
      message: "E-Waste item registered successfully",
      item: savedItem,
    });
  } catch (error) {
    console.error("Item registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering item",
    });
  }
};

const getAllItems = async (req, res) => {
  try {
    const items = await EWasteItem.find().sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: items.length,
      items: items,
    });
  } catch (error) {
    console.error("Error fetching items: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching items",
    });
  }
};

module.exports = { createItem, getAllItems };
