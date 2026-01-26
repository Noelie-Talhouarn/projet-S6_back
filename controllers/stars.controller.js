import Star from '../models/Star.js';


// --- GET ALL STARS ---
export const getStars = async (req, res) => {
    try {
        const userId = req.user.id;

        // Récupérer toutes les étoiles de l'utilisateur
        const stars = await Star.find({ user: userId }).sort({ createdAt: 1 }); // Tri chronologique pour l'apparition? Ou aléatoire?
        // Ici on recupere tout, le front décidera de l'affichage.

        // Formater la réponse pour qu'elle soit facile à utiliser par le front
        const formattedStars = stars.map(star => ({
            id: star._id,
            x: star.x,
            y: star.y,
            message: star.message,
            intensity: star.intensity,
            date: star.date,
            createdAt: star.createdAt
        }));

        res.json(formattedStars);
    } catch (error) {
        console.error("Erreur lors de la récupération des étoiles:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des étoiles", error: error.message });
    }
};

// --- CREATE STAR ---
export const createStar = async (req, res) => {
    try {
        const userId = req.user.id;
        const { x, y, message, intensity, date } = req.body;

        // Validation des données
        if (x === undefined || y === undefined || !message) {
            return res.status(400).json({ message: "Les champs x, y et message sont requis." });
        }

        if (x < 0 || x > 100 || y < 0 || y > 100) {
            return res.status(400).json({ message: "La position (x, y) doit être entre 0 et 100." });
        }

        // Création de l'étoile
        const newStar = new Star({
            user: userId,
            x,
            y,
            message,
            intensity: intensity || 'medium',
            date: date || new Date(),
        });

        await newStar.save();

        res.status(201).json({
            message: "Étoile ajoutée au ciel ✨",
            star: {
                id: newStar._id,
                x: newStar.x,
                y: newStar.y,
                message: newStar.message,
                intensity: newStar.intensity,
                date: newStar.date,
                createdAt: newStar.createdAt
            }
        });



    } catch (error) {
        console.error("Erreur lors de la création de l'étoile:", error);
        res.status(500).json({ message: "Erreur lors de la création de l'étoile", error: error.message });
    }
};

// --- DELETE STAR ---
export const deleteStar = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Vérifier que l'étoile existe et appartient à l'utilisateur
        const star = await Star.findOne({ _id: id, user: userId });

        if (!star) {
            return res.status(404).json({ message: "Étoile introuvable ou ne vous appartient pas." });
        }

        await Star.deleteOne({ _id: id });

        res.json({ message: "Étoile supprimée du ciel", id });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'étoile:", error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'étoile", error: error.message });
    }
};
