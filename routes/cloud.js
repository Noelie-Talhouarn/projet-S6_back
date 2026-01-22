import express from 'express';
import { getCloudWords, addCloudWord } from '../controllers/cloud.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/cloud-words : Public (ou protégé si tu préfères)
router.get('/', getCloudWords);

// POST /api/cloud-words : Protégé (pour ajouter des mots dynamiquement)
router.post('/', authMiddleware, addCloudWord);

export default router;
