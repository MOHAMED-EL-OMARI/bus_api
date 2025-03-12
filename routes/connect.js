const express = require("express");
const router = express.Router();
const { connectDB } = require("../db"); // Import the connectDB function

// Route to handle connection
router.post("/connect", (req, res) => {
    const { host, user, password, database, port } = req.body;

    // Create the connection using the values from the request
    connectDB({ host, user, password, database, port });

    res.json({ message: "Connected successfully!" });
});

module.exports = router;
