const express = require("express");
const Event = require("../Model/Event");
const upload = require("../Middleware/upload");
const category = require("../Model/Category")
exports.addEvent= async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { eventName, eventDate, category } = req.body;

        if (!eventName || !eventDate || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const event = new Event({
            eventName,
            eventDate,
            category,
            image: req.file ? req.file.path : null,
        });

        await event.save();
        res.status(201).json({ message: "Event added successfully", event });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// exports.EventGet= async (req, res) => {
//     try {
//         const events = await Event.find(); 
//         res.status(200).json(events);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


exports.EventGet= async (req, res) => {
    try {
        const events = await Event.find().populate("category");
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events" });
    }
};

exports.EventgetById=async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.EventEdit=async (req, res) => {
    try {
        const { eventName, eventDate, category } = req.body;

        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        event.eventName = eventName || event.eventName;
        event.eventDate = eventDate || event.eventDate;
        event.category = category || event.category;
        
        if (req.file) {
            event.image = req.file.path;
        }
        await event.save();

        res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.EventDelete=async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await event.deleteOne(); 

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};