import Meditation from '../models/Meditation.js';

// --- GET ALL MEDITATIONS ---
export const getMeditations = async (req, res) => {
    try {
        const meditations = await Meditation.find().sort({ createdAt: -1 });
        res.json(meditations);
    } catch (error) {
        console.error("Erreur récupération:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- ADD MEDITATION (Simple URL) ---
export const addMeditation = async (req, res) => {
    try {
        // On reçoit directement les URLs depuis le corps de la requête (envoyées par le front après upload Cloudinary)
        const { title, description, category, duration, audio_url, image_url } = req.body;

        if (!title || !category || !duration || !audio_url) {
            return res.status(400).json({ message: "Titre, catégorie, durée et URL audio sont requis." });
        }

        const newMeditation = new Meditation({
            title,
            description: description || '',
            category,
            duration,
            audio_url, // L'URL Cloudinary (ex: "https://res.cloudinary.com/...")
            image_url: image_url || '',
        });

        await newMeditation.save();

        res.status(201).json({
            message: "Méditation ajoutée avec succès ✨",
            meditation: newMeditation
        });
    } catch (error) {
        console.error("Erreur ajout:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- DELETE MEDITATION ---
export const deleteMeditation = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Meditation.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Méditation non trouvée" });
        }

        res.json({ message: "Méditation supprimée de la base de données" });
    } catch (error) {
        console.error("Erreur suppression:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- RECORD SESSION (Historique) ---
export const recordSession = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("📝 Enregistrement session reçue:", req.body);
        const { duration, type, meditationId } = req.body;

        // Validation basique
        if (!duration) {
            return res.status(400).json({ message: "La durée est requise." });
        }

        // Import dynamique pour éviter les dépendances circulaires si besoin
        // (Ici c'est propre, on peut importer en haut, mais restons cohérents avec le style)
        const BreathingSession = (await import('../models/BreathingSession.js')).default;

        const newSession = new BreathingSession({
            user: userId,
            duration: Number(duration), // En SECONDES
            type: type || 'meditation', // 'coherence_cardiaque' ou 'meditation'
            meditation: meditationId || null // Lien vers la méditation du catalogue si applicable
        });

        await newSession.save();

        res.status(201).json({
            message: "Session enregistrée avec succès 🧘",
            session: newSession
        });

    } catch (error) {
        console.error("Erreur enregistrement session:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement de la session." });
    }
};
