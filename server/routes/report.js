/*
  - POST '/' : Generates a financial report based on criteria provided in the request body. 
               Criteria may include startDate, endDate, and type of financial records.

  Example request body:
  {
    "startDate": "2024-01-01",
    "endDate": "2024-04-30",
    "type": "expense"
  }

  The generated report includes financial records that match the specified criteria, along with any relevant statistics.
  You can customize the statistics calculation based on your specific requirements.
*/

// server/routes/report.js

import express from "express";
import db from "../db/connection.js";

const router = express.Router();

// Route for generating the financial report
router.post("/", async (req, res) => {
    try {
        // Retrieve report criteria from request body
        const { startDate, endDate, type } = req.body;

        // Query the database for financial records based on criteria
        const collection = await db.collection("records");
        let query = {};
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (type) {
            query.type = type;
        }
        const results = await collection.find(query).toArray();

        // Calculate statistics (e.g., total expenses)
        // You can customize this based on your requirements

        // Return the generated report
        res.json({ success: true, report: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error generating report" });
    }
});

export default router;
