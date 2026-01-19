import express from 'express';
import { getGames, getProgress, saveProgress, resetProgress } from '../controllers/games.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * 🎮 Récupérer tous les mini-jeux
 * (Protégée : il faut être connecté pour voir les jeux)
 */
router.get('/', authMiddleware, getGames);

/**
 * 💾 Récupérer la progression d'un jeu (Sauvegarde)
 * Nécessite d'être connecté.
 */
router.get('/:gameId/progress', authMiddleware, getProgress);

/**
 * 💾 Sauvegarder la progression d'un jeu
 * Nécessite d'être connecté.
 */
router.post('/:gameId/progress', authMiddleware, saveProgress);

/**
 * 🗑️ Réinitialiser la progression (Reset)
 * Nécessite d'être connecté.
 */
router.delete('/:gameId/progress', authMiddleware, resetProgress);

export default router;
