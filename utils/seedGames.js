import Game from '../models/Game.js';

const GAMES_TO_SEED = [
    {
        title: "Mandala de Lumière",
        type: "coloriage",
        description: "Peignez avec la lumière. La couleur se diffuse comme de l'encre sur du papier.",
        instructions: "Cliquez et maintenez pour diffuser la couleur.",
        difficulty: 1
    },
    {
        title: "L'Attrape-Lueurs",
        type: "rythme",
        description: "Un jeu de rythme doux. Cliquez sur les cercles lumineux.",
        instructions: "Suivez le rythme et attrapez les lueurs.",
        difficulty: 2
    },
    {
        title: "L'Alchimiste des Couleurs",
        type: "camera",
        description: "Trouvez une couleur spécifique autour de vous.",
        instructions: "Autorisez la caméra et trouvez la couleur demandée.",
        difficulty: 2
    },
    {
        title: "Puzzle Zen",
        type: "puzzle",
        description: "Remettez de l'ordre dans le chaos, doucement.",
        instructions: "Glissez les pièces pour reconstituer l'image.",
        difficulty: 1
    }
];

export const seedGames = async () => {
    try {
        const count = await Game.countDocuments();

        if (count === 0) {
            console.log("🌱 Initialisation des jeux par défaut...");
            await Game.insertMany(GAMES_TO_SEED);
            console.log("✅ Jeux créés avec succès !");
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation des jeux:", error);
    }
};
