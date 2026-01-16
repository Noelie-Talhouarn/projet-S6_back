import mongoose from "mongoose";
import dotenv from "dotenv";
import Game from "./models/Game.js";

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connecté pour test");

        // Nettoyage (optionnel, pour éviter les doublons en test)
        // await Game.deleteMany({ title: "Test Game" });

        // Création d'un jeu test
        const newGame = new Game({
            title: "Test Game " + Math.floor(Math.random() * 1000),
            type: "coloriage",
            description: "Un test de douceur",
            difficulty: 1
        });

        await newGame.save();
        console.log("✨ Jeu créé avec succès :", newGame.title);

        const games = await Game.find();
        console.log(`📚 Il y a ${games.length} jeux dans la collection.`);

        console.log("TEST RÉUSSI !");
        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur:", error);
        process.exit(1);
    }
};

verify();
