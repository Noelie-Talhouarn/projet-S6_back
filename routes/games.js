import express from 'express';
import { getGames, getProgress, saveProgress, resetProgress } from '../controllers/games.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import Word from '../models/Word.js';

const router = express.Router();

/**
 * 🎮 Récupérer tous les mini-jeux
 */
router.get('/', authMiddleware, getGames);

/* 
 * GET /api/games/words/random
 * Renvoie un mot depuis TA base de données MongoDB (Collection 'words')
 */
router.get('/words/random', async (req, res) => {
    try {
        // 1. On utilise l'agrégation MongoDB pour tirer un mot au hasard
        const randomDocs = await Word.aggregate([
            { $sample: { size: 1 } }
        ]);

        // Si la base est vide (pas encore remplie à la main)
        if (!randomDocs || randomDocs.length === 0) {
            console.warn("⚠️ Attention : La collection 'words' est vide dans MongoDB.");
            // On renvoie un mot par défaut pour ne pas casser le jeu
            return res.status(200).json({
                word: "LUMIÈRE",
                theme: "lumière",
                source: "fallback_empty_db"
            });
        }

        const wordObj = randomDocs[0];

        res.status(200).json({
            word: wordObj.text,
            theme: wordObj.theme
        });

    } catch (error) {
        console.error("Erreur Mots DB:", error.message);
        res.status(500).json({ word: 'LUMIÈRE', theme: 'lumière', source: 'backup_error' });
    }
});

/**
 * 💾 Sauvegardes de progression
 */
router.get('/:gameId/progress', authMiddleware, getProgress);
router.post('/:gameId/progress', authMiddleware, saveProgress);
router.delete('/:gameId/progress', authMiddleware, resetProgress);

export default router;
