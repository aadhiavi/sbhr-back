// routes/contact.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

// Add a contact
router.post("/post/:city", async (req, res) => {
    try {
        const { city } = req.params;
        const { name, number, email, start, end, message } = req.body;

        if (!["Hyderabad", "Guntur", "Bangalore"].includes(city)) {
            return res.status(400).json({ message: "Invalid city" });
        }

        const newContact = new Contact({
            name,
            number,
            email,
            city,
            start: new Date(start),
            end: new Date(end),
            message
        });

        await newContact.save();
        res.status(201).json({ message: "Contact saved successfully" });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get all contacts by city
router.get("/get/:city", async (req, res) => {
    try {
        const { city } = req.params;

        if (!["Hyderabad", "Guntur", "Bangalore"].includes(city)) {
            return res.status(400).json({ message: "Invalid city" });
        }

        const contacts = await Contact.find({ city });
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update a contact
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, number, email, city, start, end, message } = req.body;

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { name, number, email, city, start: new Date(start), end: new Date(end), message },
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json(updatedContact);
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete a contact
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;

