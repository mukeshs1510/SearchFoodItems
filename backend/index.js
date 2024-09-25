import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Router from "./Router.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

app.use("/api/v1", Router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
