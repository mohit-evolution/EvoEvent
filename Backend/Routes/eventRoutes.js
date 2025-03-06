const express = require("express");
const Event = require("../Model/Event");
const upload = require("../Middleware/upload");

const router = express.Router();

router.post("/addEvent", upload.single("image"), async (req, res) => {
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
});

router.get("/getEvent", async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events from DB
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.put("/editEvent/:id", upload.single("image"), async (req, res) => {
    try {
        const { eventName, eventDate, category } = req.body;

        // Find the existing event
        let event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Update event details
        event.eventName = eventName || event.eventName;
        event.eventDate = eventDate || event.eventDate;
        event.category = category || event.category;
        
        // Update image if a new one is uploaded
        if (req.file) {
            event.image = req.file.path;
        }

        // Save updated event
        await event.save();

        res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete("/deleteEvent/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await event.deleteOne(); // Delete the event

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



module.exports = router;
