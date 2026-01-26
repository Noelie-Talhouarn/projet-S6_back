import mongoose from 'mongoose';

/**
 * Modèle pour enregistrer les sessions de respiration/méditation
 * Permet de suivre la pratique de l'utilisateur pour les statistiques
 */
const BreathingSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // Index pour optimiser les requêtes par utilisateur
    },
    // Durée de la session en SECONDES (ex: 300 pour 5 minutes)
    duration: {
        type: Number,
        required: true,
        min: 0,
    },
    // Type de session (cohérence cardiaque, méditation guidée, etc.)
    type: {
        type: String,
        enum: ['coherence_cardiaque', 'meditation', 'respiration_libre'],
        default: 'coherence_cardiaque',
    },
    // (Optionnel) ID de la méditation écoutée si c'est une méditation guidée
    meditation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meditation',
        required: false
    },
    // Date de la session
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('BreathingSession', BreathingSessionSchema);
