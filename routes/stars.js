import express from 'express';
import { getStars, createStar, deleteStar } from '../controllers/stars.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Route: /api/stars - Récupérer toutes les étoiles
router.get('/', getStars);

// Route: /api/stars - Créer une nouvelle étoile
router.post('/', createStar);

// Route: /api/stars/:id - Supprimer une étoile
router.delete('/:id', deleteStar);

export default router;
