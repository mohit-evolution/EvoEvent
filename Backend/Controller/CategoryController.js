const express = require("express");
const Category = require("../Model/Category");

exports.addCategory =async (req, res) => {
    try {
        const { name } = req.body;
        
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const newCategory = new Category({ name });
        await newCategory.save();
        
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error adding category" });
    }
};

exports.getCategory= async (req, res) => {
    try {
        const categories = await Category.find({}, "_id name");
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories" });
    }
};

