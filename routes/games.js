import express from "express";
import Game from "../models/Game.js";

const router = express.Router();

/**
 * 🎮 Récupérer tous les mini-jeux
 */
router.get("/", async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        console.error("Erreur récuperation jeux:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/**
 * ✨ Créer un nouveau jeu
 */
router.post("/", async (req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        console.error("Erreur création jeu:", error);
        res.status(400).json({ error: error.message });
    }
});

export default router;
