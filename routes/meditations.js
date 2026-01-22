import express from 'express';
import { getMeditations, addMeditation, deleteMeditation } from '../controllers/meditations.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/meditations/categories (Public)
router.get('/categories', (req, res) => {
    const categories = [
        { id: 'sommeil', label: 'Sommeil' },
        { id: 'nature', label: 'Nature' },
        { id: 'musique', label: 'Musique' },
        { id: 'guide', label: 'Guidé' }
    ];
    res.json(categories);
});

// GET /api/meditations (Public)
router.get('/', getMeditations);

// POST /api/meditations (Protégé)
// Attend un JSON body : { title, category, duration, audio_url, ... }
router.post('/', authMiddleware, addMeditation);

// DELETE /api/meditations/:id (Protégé)
router.delete('/:id', authMiddleware, deleteMeditation);

export default router;
