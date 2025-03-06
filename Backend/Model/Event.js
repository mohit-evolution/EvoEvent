const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    category: { type: String, required: true },
    image: { type: String }, // Store image path
});

module.exports = mongoose.model("Event", eventSchema);
