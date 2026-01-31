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
    updateMandalaLevel,
    getPuzzleLevel,
    updatePuzzleLevel,
    updateEmotion,
    getFavorites,
    toggleFavorite,
    updateAvatar,
    forgotPassword,
    resetPassword
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

// Route: /api/users/forgot-password - Demander un lien de secours
router.post('/forgot-password', forgotPassword);

// Route: /api/users/reset-password - Changer le mot de passe avec le jeton
router.post('/reset-password', resetPassword);

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

// Route: /api/users/puzzle - Récupérer le niveau du puzzle
router.get('/puzzle', authMiddleware, getPuzzleLevel);

// Route: /api/users/puzzle - Sauvegarder le niveau du puzzle
router.post('/puzzle', authMiddleware, updatePuzzleLevel);

// Route: /api/users/emotion - Mettre à jour l'émotion de l'utilisateur
router.post('/emotion', authMiddleware, updateEmotion);

// ========================================
// Routes Favoris (Citations & Méditations)
// ========================================

// Route: /api/users/favorites - Récupérer les favoris de l'utilisateur
router.get('/favorites', authMiddleware, getFavorites);

// Route: /api/users/favorites - Toggle un favori (ajoute si absent, retire si présent)
router.post('/favorites', authMiddleware, toggleFavorite);

// Route: /api/users/avatar - Mettre à jour la photo de profil
router.patch('/avatar', authMiddleware, updateAvatar);

export default router;
