const express = require("express");
const cors = require("cors");
const app = express();
const connectRoutes = require("./routes/connect");
const visitRoutes = require("./routes/visit");
require('dotenv').config();
require("./conn/conn");

app.use(express.json());
app.use(cors());
app.use('/api/v1', connectRoutes);
app.use('/api/v1', visitRoutes);

app.listen(5000, () => {
    console.log("Server started at port 5000");
});


