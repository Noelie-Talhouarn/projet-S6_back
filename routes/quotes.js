import express from 'express';
import axios from 'axios';
import Quote from '../models/Quote.js';

const router = express.Router();

// Fonction pour traduire en français via MyMemory (API gratuite)
async function translateToFrench(text) {
    try {
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: text,
                langpair: 'en|fr'
            }
        });
        return response.data.responseData.translatedText;
    } catch (error) {
        console.error('Erreur traduction:', error.message);
        return text; // Si la traduction échoue, on garde l'anglais
    }
}

// Route: /api/quotes/daily
router.get('/daily', async (req, res) => {
    try {
        // 1. Quelle date sommes-nous ? (Format YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];

        // 2. Est-ce qu'on a DÉJÀ une citation pour aujourd'hui en base ?
        let dailyQuote = await Quote.findOne({ date: today });

        if (dailyQuote) {
            console.log("✅ Citation trouvée en cache (DB).");
            return res.json({
                citation: dailyQuote.content,
                auteur: dailyQuote.author,
                source: "L'Étincelle"
            });
        }

        // 3. Sinon, on va la chercher chez ZenQuotes
        console.log("🌍 Appel API ZenQuotes...");
        const response = await axios.get('https://zenquotes.io/api/today');
        const quoteData = response.data[0];

        // 4. Traduction en français (UNIQUEMENT la citation)
        console.log("🔄 Traduction de la citation en français...");
        const citationFr = await translateToFrench(quoteData.q);

        // On garde l'auteur en version originale (pas de traduction du nom)
        const auteurOriginal = quoteData.a;

        // 5. On la sauvegarde pour les prochains visiteurs
        dailyQuote = new Quote({
            content: citationFr,
            author: auteurOriginal,
            date: today
        });
        await dailyQuote.save();
        console.log("💾 Nouvelle citation sauvegardée (citation traduite, auteur original).");

        res.json({
            citation: dailyQuote.content,
            auteur: dailyQuote.author,
            source: "ZenQuotes"
        });

    } catch (error) {
        console.error("Erreur ZenQuotes/DB:", error.message);
        // Fallback
        res.json({
            citation: "La beauté est partout, il suffit de savoir regarder.",
            auteur: "L'Étincelle",
            source: "Interne (Erreur)"
        });
    }
});

export default router;
