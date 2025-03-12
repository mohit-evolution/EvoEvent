const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    // users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
},
{ timestamps: true }
);

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
