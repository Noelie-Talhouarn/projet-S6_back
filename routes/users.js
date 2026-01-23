import express from 'express';
import {
    register,
    login,
    getProfile,
    updateProfile,
    getUserStats,
    updatePreferences,
    deleteAccount,
    getMandalaLevel,
    updateMandalaLevel
} from '../controllers/users.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// ========================================
// Routes publiques (sans authentification)
// ========================================

// Route: /api/users/register
router.post('/register', register);

// Route: /api/users/login
router.post('/login', login);

// ========================================
// Routes protégées (avec authentification JWT)
// ========================================

// Route: /api/users/me (Ancienne route, conservée pour compatibilité)
router.get('/me', authMiddleware, getProfile);

// Route: /api/users/profile - Récupérer le profil utilisateur
router.get('/profile', authMiddleware, getProfile);

// Route: /api/users/profile - Mettre à jour le profil utilisateur
router.put('/profile', authMiddleware, updateProfile);

// Route: /api/users/stats - Récupérer les statistiques utilisateur
router.get('/stats', authMiddleware, getUserStats);

// Route: /api/users/preferences - Sauvegarder les préférences utilisateur
router.put('/preferences', authMiddleware, updatePreferences);

// Route: /api/users/account - Supprimer le compte utilisateur (⚠️ Action irréversible)
router.delete('/account', authMiddleware, deleteAccount);

// Route: /api/users/mandala - Récupérer le niveau du mandala
router.get('/mandala', authMiddleware, getMandalaLevel);

// Route: /api/users/mandala - Sauvegarder le niveau du mandala
router.post('/mandala', authMiddleware, updateMandalaLevel);

export default router;
