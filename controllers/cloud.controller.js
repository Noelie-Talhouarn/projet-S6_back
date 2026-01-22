import CloudWord from '../models/CloudWord.js';

// Liste par défaut pour initialiser la base de données
const DEFAULT_WORDS = [
    "Espoir", "Lumière", "Force", "Amour", "Sérénité",
    "Joie", "Confiance", "Paix", "Harmonie", "Rêve",
    "Courage", "Gratitude", "Liberté", "Magie", "Douceur"
];

// --- GET CLOUD WORDS ---
export const getCloudWords = async (req, res) => {
    try {
        // 1. Vérifier si des mots existent déjà
        const count = await CloudWord.countDocuments();

        // 2. Si aucun mot n'existe, on initialise la base avec les mots par défaut
        if (count === 0) {
            console.log("☁️ Initialisation des mots du nuage...");
            const wordsToInsert = DEFAULT_WORDS.map(word => ({ word }));
            await CloudWord.insertMany(wordsToInsert);
        }

        // 3. Récupérer tous les mots de la base de données
        const wordsDocs = await CloudWord.find().sort({ createdAt: -1 });

        // 4. Extraire juste les chaînes de caractères pour renvoyer un tableau simple
        // Exemple: ["Espoir", "Lumière", ...] au lieu de [{_id:..., word:"Espoir"}, ...]
        const wordsList = wordsDocs.map(doc => doc.word);

        res.json(wordsList);
    } catch (error) {
        console.error("Erreur lors de la récupération des mots du nuage:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// --- ADD CLOUD WORD (Optionnel, pour le futur) ---
export const addCloudWord = async (req, res) => {
    try {
        const { word } = req.body;
        if (!word) {
            return res.status(400).json({ message: "Le mot est requis" });
        }

        const newWord = new CloudWord({ word });
        await newWord.save();

        res.status(201).json({ message: "Mot ajouté", word: newWord.word });
    } catch (error) {
        // Gestion de l'erreur "Doublon" (code 11000)
        if (error.code === 11000) {
            return res.status(409).json({ message: "Ce mot existe déjà" });
        }
        res.status(500).json({ message: "Erreur lors de l'ajout", error: error.message });
    }
};
