const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();

// ✅ CORS (VERY IMPORTANT)
app.use(cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
