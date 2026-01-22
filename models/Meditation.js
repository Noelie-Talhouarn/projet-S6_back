import mongoose from 'mongoose';

/**
 * Modèle simple pour les méditations
 * Stocke l'URL vers le fichier physique
 */
const MeditationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: {
        type: String,
        enum: ['guide', 'nature', 'musique'],
        required: true
    },
    duration: { type: String, required: true },

    // Stockage de l'URL (chemin vers uploads/...)
    audio_url: { type: String, required: true },
    image_url: { type: String, default: '' },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Meditation', MeditationSchema);
