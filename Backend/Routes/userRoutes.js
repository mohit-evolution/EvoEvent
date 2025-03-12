const express = require("express");
const { register, login,getUser } = require("../Controller/UserController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUser",getUser)
module.exports = router;
