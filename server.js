// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import sparkRoutes from "./routes/sparks.js";
import gameRoutes from "./routes/games.js";
import quoteRoutes from "./routes/quotes.js";
import usersRoutes from "./routes/users.js";
import starRoutes from "./routes/stars.js";
import cloudRoutes from "./routes/cloud.js";
import meditationRoutes from "./routes/meditations.js";
import lueurRoutes from "./routes/lueurs.js";
import { seedGames } from "./utils/seedGames.js";
import { seedLueurs } from "./utils/seedLueurs.js";

dotenv.config();

const startServer = async () => {
  await connectDB();
  await seedGames(); // Initialiser les jeux par défaut
  await seedLueurs(); // Initialiser les lueurs par défaut ✨

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '5mb' })); // Permet de recevoir des images en Base64 ✨
  app.use(express.urlencoded({ limit: '5mb', extended: true }));

  // Routes
  app.use("/api/users", usersRoutes);
  app.use("/api/sparks", sparkRoutes);
  app.use("/api/games", gameRoutes);
  app.use("/api/quotes", quoteRoutes);
  app.use("/api/stars", starRoutes);
  app.use("/api/cloud-words", cloudRoutes);
  app.use("/api/meditations", meditationRoutes);
  app.use("/api/lueurs", lueurRoutes); // ✨ Nouvelle route pour les avatars poétiques

  app.get("/", (req, res) => {
    res.send("API Étincelle OK ✨");
  });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${process.env.PORT}`);
  });
};

startServer();
