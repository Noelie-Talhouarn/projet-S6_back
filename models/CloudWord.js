import mongoose from 'mongoose';

/**
 * Modèle pour les mots du nuage
 * Stocke les mots positifs affichés dans le nuage de mots.
 */
const CloudWordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true, // Évite les doublons
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('CloudWord', CloudWordSchema);
