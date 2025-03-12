const express = require("express");
const router = express.Router();
const {addRole} = require("../Controller/RoleController")
const{authMiddleware} = require("../Middleware/authMiddleware")
router.post("/addrole", addRole);
// router.get("/getrole",getRole);
module.exports = router;