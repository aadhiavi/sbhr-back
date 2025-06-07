const express = require("express");
const router = express.Router();
const Visit = require("../models/visit");
const requestIp = require('request-ip');

router.use(requestIp.mw());

router.get('/visit', async (req, res) => {
    const ip = req.clientIp;
    try {
        const ip = req.ip;

        const visit = new Visit({ ip });
        await visit.save();

        const count = await Visit.countDocuments();

        res.json({ count });
    } catch (error) {
        console.error("Error logging visit:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

