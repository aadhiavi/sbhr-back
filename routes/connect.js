const express = require("express");
const router = express.Router();
const Connect = require("../models/connect");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// POST
router.post("/add-connect", async (req, res) => {
    const { name, number, email, city, message } = req.body;

    try {
        const newConnect = new Connect({ name, number, email, city, message });
        await newConnect.save();
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Thank You for Contacting Us",
            text: `Dear ${name},\n\nThank you for reaching out to Suhana Beulah Hotels and Resorts.\n\nWe’ve received your message and will get back to you shortly.\n\nBest regards,\nSuhana Beulah Hotels and Resorts`,
        };

        transporter.sendMail(userMailOptions, (userErr, userInfo) => {
            if (userErr) {
                console.error("❌ Error sending email to user:", userErr);
            } else {
                console.log("✅ User email sent:", userInfo.response);
            }
        });

        const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmails,
            subject: "New Contact Form Submission",
            text: `📥 New submission received:\n\nName: ${name}\nNumber: ${number}\nEmail: ${email}\nCity: ${city}\nMessage: ${message}`,
        };

        transporter.sendMail(adminMailOptions, (adminErr, adminInfo) => {
            if (adminErr) {
                console.error("❌ Error sending email to admins:", adminErr);
                return res.status(500).json({ success: false, message: "Form saved, but admin email failed" });
            }

            console.log("✅ Admin notification sent:", adminInfo.response);
            return res.status(200).json({ success: true, message: "Form submitted successfully" });
        });

    } catch (error) {
        console.error("❌ Error saving entry:", error);
        res.status(500).json({ success: false, message: "Failed to save entry" });
    }
});

// GET
router.get("/get-connect", async (req, res) => {
    try {
        const connects = await Connect.find();
        res.status(200).json({ success: true, data: connects });
    } catch (error) {
        console.error("❌ Error fetching entries:", error);
        res.status(500).json({ success: false, message: "Failed to fetch entries" });
    }
});

// Update
router.put("/update-connect/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedConnect = await Connect.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedConnect) {
            return res.status(404).json({ success: false, message: "Entry not found" });
        }

        res.status(200).json({ success: true, data: updatedConnect });
    } catch (error) {
        console.error("❌ Error updating entry:", error);
        res.status(500).json({ success: false, message: "Failed to update entry" });
    }
});

// DELETE
router.delete("/delete-connect/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedConnect = await Connect.findByIdAndDelete(id);

        if (!deletedConnect) {
            return res.status(404).json({ success: false, message: "Entry not found" });
        }

        res.status(200).json({ success: true, message: "Entry deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting entry:", error);
        res.status(500).json({ success: false, message: "Failed to delete entry" });
    }
});

module.exports = router;

