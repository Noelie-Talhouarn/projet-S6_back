import mongoose from "mongoose";
import dotenv from "dotenv";
import Game from "./models/Game.js";

dotenv.config();

const seedGames = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connecté à la base de données");

        // Nettoyer la collection existante pour éviter les doublons
        await Game.deleteMany({});
        console.log("🧹 Collection 'games' nettoyée");

        const games = [
            {
                title: "Coloriage Organique",
                type: "coloriage",
                description: "Peins avec la lumière et laisse les couleurs se diffuser doucement.",
                instructions: "Touche l'écran pour déposer de l'encre lumineuse.",
                difficulty: 1,
            },
            {
                title: "L'Attrape-Lueurs",
                type: "rythme",
                description: "Un jeu de rythme apaisant pour révéler des mots de pouvoir.",
                instructions: "Clique sur les cercles au bon moment pour former le mot.",
                difficulty: 2,
            },
            {
                title: "L'Alchimiste des Couleurs",
                type: "camera",
                description: "Capture les couleurs de ton environnement pour transformer ton interface.",
                instructions: "Trouve la couleur demandée autour de toi et prends-la en photo.",
                difficulty: 2,
            },
        ];

        await Game.insertMany(games);
        console.log("✨ 3 jeux ont été ajoutés avec succès !");

        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur :", error);
        process.exit(1);
    }
};

seedGames();
