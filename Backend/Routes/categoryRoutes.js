const express = require("express");
const{addCategory,getCategory} =require('../Controller/CategoryController')
const router = express.Router();
const{authMiddleware} = require("../Middleware/authMiddleware")
router.post("/addcategory",authMiddleware, addCategory);
router.get("/getcategory",authMiddleware, getCategory);
// router.get("/:id", EventgetById);
// router.put("/editEvent/:id", EventEdit);
// router.delete("/deleteEvent/:id",EventDelete)

module.exports = router;