import express from 'express';
import { register, login } from '../controllers/users.controller.js';

const router = express.Router();

// Route: /api/users/register
router.post('/register', register);

// Route: /api/users/login
router.post('/login', login);

import { authMiddleware } from '../middleware/auth.middleware.js';
import { getProfile } from '../controllers/users.controller.js';

// Route: /api/users/me (Protégée)
router.get('/me', authMiddleware, getProfile);

export default router;
