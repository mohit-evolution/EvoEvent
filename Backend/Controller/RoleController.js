const express = require("express");
const Role = require('../Model/Role')

exports.addRole =async (req, res) => {
    try {
        const { name } = req.body;
        
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ message: "Role already exists" });
        }
        const newRole = new Role({ name });
        console.log(newRole,"New Role of data")
        await newRole.save();
        
        res.status(201).json({ message: "Role Add Successfully", newRole });
    } catch (error) {
        res.status(500).json({ message: "Error adding add role" });
    }
};

// exports.getRoleById= async (req, res) => {
//     try {
//         const roles = await Role.find().populate("users");
//         res.json(roles);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching Role" });
//     }
// };