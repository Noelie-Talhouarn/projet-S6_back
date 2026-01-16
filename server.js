// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import sparkRoutes from "./routes/sparks.js";
import gameRoutes from "./routes/games.js";



dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(cors());
  app.use(express.json());



  app.get("/", (req, res) => {
    res.send("API Étincelle OK ✨");
  });

  app.use("/api/sparks", sparkRoutes);
  app.use("/api/games", gameRoutes);

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${process.env.PORT}`);
  });
};

startServer();



