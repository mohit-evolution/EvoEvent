
const express = require("express");
const{addEvent,EventGet,EventgetById,EventEdit,EventDelete} =require('../Controller/EventController')
const router = express.Router();
const upload = require("../Middleware/upload");
router.post("/addEvent",upload.single("image"), addEvent);
router.get("/getEvent", EventGet);
router.get("/:id", EventgetById);
router.put("/editEvent/:id",upload.single("image"), EventEdit);
router.delete("/deleteEvent/:id",EventDelete)

module.exports = router;




