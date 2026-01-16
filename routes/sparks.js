import express from "express";
import Spark from "../models/Spark.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sparks = await Spark.find().sort({ createdAt: -1 }).limit(20);
  res.json(sparks);
});

router.post("/", async (req, res) => {
  const spark = await Spark.create(req.body);
  res.json(spark);
});

export default router;
