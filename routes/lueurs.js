import express from 'express';
import Lueur from '../models/Lueur.js';

const router = express.Router();

// GET /api/lueurs - Récupérer toutes les lueurs disponibles
router.get('/', async (req, res) => {
    try {
        const lueurs = await Lueur.find();
        res.json(lueurs);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des lueurs", error: error.message });
    }
});

// GET /api/lueurs/:id_technique - Récupérer une lueur spécifique
router.get('/:id', async (req, res) => {
    try {
        const lueur = await Lueur.findOne({ id_technique: req.params.id });
        if (!lueur) return res.status(404).json({ message: "Lueur introuvable" });
        res.json(lueur);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

export default router;
