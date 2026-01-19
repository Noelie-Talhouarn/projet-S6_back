import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quote from './models/Quote.js';

dotenv.config();

const clearTodayQuote = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🧹 Connexion à la base...");

        const today = new Date().toISOString().split('T')[0];

        const result = await Quote.deleteOne({ date: today });

        if (result.deletedCount > 0) {
            console.log(`✅ Citation du ${today} supprimée.`);
            console.log("🔄 La prochaine requête va récupérer une nouvelle citation traduite.");
        } else {
            console.log("ℹ️ Aucune citation trouvée pour aujourd'hui.");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Erreur:", error);
        process.exit(1);
    }
};

clearTodayQuote();
