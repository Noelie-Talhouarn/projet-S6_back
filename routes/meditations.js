import express from 'express';
import { getMeditations, addMeditation, deleteMeditation } from '../controllers/meditations.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/meditations (Public)
router.get('/', getMeditations);

// POST /api/meditations (Protégé)
// Attend un JSON body : { title, category, duration, audio_url, ... }
router.post('/', authMiddleware, addMeditation);

// DELETE /api/meditations/:id (Protégé)
router.delete('/:id', authMiddleware, deleteMeditation);

export default router;
