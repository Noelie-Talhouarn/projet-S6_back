import Game from '../models/Game.js';
import GameProgress from '../models/GameProgress.js';

// --- LISTER LES JEUX ---
export const getGames = async (req, res) => {
    try {
        // On récupère tous les jeux actifs
        // On pourrait filtrer par difficulté, type, etc.
        const games = await Game.find({ isActive: true });
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des jeux." });
    }
};

// --- RÉCUPÉRER LA PROGRESSION (SAVE) ---
export const getProgress = async (req, res) => {
    try {
        const { gameId } = req.params;
        const userId = req.user.id; // Vient du middleware auth

        const progress = await GameProgress.findOne({ game: gameId, user: userId });

        if (!progress) {
            // Pas encore de sauvegarde, on renvoie un objet vide ou null, c'est normal
            return res.json({ data: null, status: 'new' });
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du chargement de la progression." });
    }
};

// --- SAUVEGARDER LA PROGRESSION ---
export const saveProgress = async (req, res) => {
    try {
        const { gameId } = req.params;
        const userId = req.user.id;
        const { data, status } = req.body;

        // Upsert: On met à jour si ça existe, sinon on crée
        const progress = await GameProgress.findOneAndUpdate(
            { game: gameId, user: userId },
            {
                data,
                status: status || 'in_progress',
                lastPlayed: Date.now()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({ message: "Progression sauvegardée !", progress });
    } catch (error) {
        console.error("Erreur save:", error);
        res.status(500).json({ message: "Erreur lors de la sauvegarde." });
    }
};

// --- RESET PROGRESSION ---
export const resetProgress = async (req, res) => {
    try {
        const { gameId } = req.params;
        const userId = req.user.id;

        await GameProgress.findOneAndDelete({ game: gameId, user: userId });

        res.json({ message: "Progression réinitialisée." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la réinitialisation." });
    }
};
