import CloudWord from '../models/CloudWord.js';

// Liste par défaut pour initialiser la base de données
// --- GET CLOUD WORDS ---
export const getCloudWords = async (req, res) => {
    try {
        // Récupérer tous les mots de la base de données
        const wordsDocs = await CloudWord.find().sort({ createdAt: -1 });

        // Extraire juste les chaînes de caractères
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
