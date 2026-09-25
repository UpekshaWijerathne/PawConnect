require("dotenv").config();

const express = require("express");
const connectDB = require("./db");

const User = require("./models/User");
const Pet = require("./models/Pet");
const AdoptionRequest = require("./models/AdoptionRequest");
const Article = require("./models/Article");

const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const petRoutes = require("./routes/pet");

const app = express();

const PORT = 5000;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/pets", petRoutes);

app.get("/", (req, res) => {
    res.send("PawConnect API is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});