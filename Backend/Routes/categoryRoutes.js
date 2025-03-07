const express = require("express");
const{addCategory,getCategory} =require('../Controller/CategoryController')
const router = express.Router();

router.post("/addcategory", addCategory);
router.get("/getcategory", getCategory);
// router.get("/:id", EventgetById);
// router.put("/editEvent/:id", EventEdit);
// router.delete("/deleteEvent/:id",EventDelete)

module.exports = router;