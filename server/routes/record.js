/*
  - GET requests to fetch all records or a specific record by ID
  - POST requests to create a new finance record
  - PATCH requests to update an existing finance record by ID
  - DELETE requests to delete a finance record by ID
*/

import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("records");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This is to create a new finance record - POST
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      cost: req.body.cost,
      type: req.body.type,
      date: req.body.date,
    };
    let collection = await db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding finance record");
  }
});

// This is to update a new finance record - PATCH
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        cost: req.body.cost,
        type: req.body.type,
        date: req.body.date,
      },
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating finance record");
  }
});

// This is to delete a record - DELETE
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting finance record");
  }
});

export default router;