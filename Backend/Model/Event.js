const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" } ,
    image: { type: String }, // Store image path
},
{ timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
