// server/server.js

import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import report from "./routes/report.js"; // Import the report route

const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/report", report); // Use the report route

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
