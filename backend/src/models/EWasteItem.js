const mongoose = require("mongoose");

const ewasteSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Phone", "SmartPhone", "Laptop", "Battery"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Mobile", "Computer", "Battery", "Accessory"],
    },
    weight: {
      type: Number,
      required: true,
      min: 0.01,
    },
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    storage: {
      type: Number,
    },
    ram: {
      type: Number,
    },
    operatingsystem: {
      type: String,
    },
    batteryType: {
      type: String,
    },
    capacity: {
      type: Number,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const EWasteItem = mongoose.model("EWasteItem", ewasteSchema);

module.exports = EWasteItem;
