// routes/connect.js
const express = require("express");
const router = express.Router();
const Connect = require("../models/connect");
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Add an entry
router.post("/add-connect", async (req, res) => {
    const { name, number, email, city, message } = req.body;

    try {
        const newConnect = new Connect({ name, number, email, city, message });
        await newConnect.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Data Entry Confirmation',
            text: `Dear ${name},\n\nThank you for your submission. Here are the details we received:\n\nName: ${name}\nNumber: ${number}\nEmail: ${email}\nCity: ${city}\nMessage: ${message}\n\nWe appreciate your response.\n\nBest regards,\nSuhana Beulah Hotels & Resorts`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ success: false, message: 'Failed to send email' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ success: true, message: 'Email sent successfully' });
        });
    } catch (error) {
        console.error('Error saving entry:', error);
        res.status(500).json({ success: false, message: 'Failed to save entry' });
    }
});

// Get all entries
router.get("/get-connect", async (req, res) => {
    try {
        const connects = await Connect.find();
        res.status(200).json({ success: true, data: connects });
    } catch (error) {
        console.error('Error fetching entries:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch entries' });
    }
});

// Update an entry
router.put("/update-connect/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedConnect = await Connect.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedConnect) return res.status(404).json({ success: false, message: 'Entry not found' });
        res.status(200).json({ success: true, data: updatedConnect });
    } catch (error) {
        console.error('Error updating entry:', error);
        res.status(500).json({ success: false, message: 'Failed to update entry' });
    }
});

// Delete an entry
router.delete("/delete-connect/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedConnect = await Connect.findByIdAndDelete(id);

        if (!deletedConnect) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }

        res.status(200).json({ success: true, message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting entry:', error);
        res.status(500).json({ success: false, message: 'Failed to delete entry' });
    }
});

module.exports = router;
