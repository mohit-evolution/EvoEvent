
const express = require("express");
const{addEvent,EventGet,EventgetById,EventEdit,EventDelete} =require('../Controller/EventController')
const router = express.Router();
const {authMiddleware,authorize} = require("../Middleware/authMiddleware")
const upload = require("../Middleware/upload");
router.post("/addEvent",upload.single("image"),authMiddleware,authorize(["Admin"]), addEvent);
router.get("/getEvent", authMiddleware,EventGet);
router.get("/:id", EventgetById);
router.put("/editEvent/:id",upload.single("image"),authMiddleware,authorize(["Admin"]), EventEdit);
router.delete("/deleteEvent/:id",authMiddleware,authorize(["Admin"]),EventDelete)

module.exports = router;
