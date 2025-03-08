
const express = require("express");
const{addEvent,EventGet,EventgetById,EventEdit,EventDelete} =require('../Controller/EventController')
const router = express.Router();
const {authMiddleware} = require("../Middleware/authMiddleware")
const upload = require("../Middleware/upload");
router.post("/addEvent",upload.single("image"),authMiddleware, addEvent);
router.get("/getEvent", authMiddleware,EventGet);
router.get("/:id", EventgetById);
router.put("/editEvent/:id",upload.single("image"),authMiddleware, EventEdit);
router.delete("/deleteEvent/:id",authMiddleware,EventDelete)

module.exports = router;
