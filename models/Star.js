import mongoose from 'mongoose';

/**
 * Modèle "Étoile" pour le Ciel Étoilé
 * Chaque étoile représente un mot doux ou un souvenir positif placé dans le ciel de l'utilisateur.
 */
const StarSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    // Position horizontale en pourcentage (0-100)
    x: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    // Position verticale en pourcentage (0-100)
    y: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    // Le mot doux ou souvenir
    message: {
        type: String,
        required: true,
        maxlength: 500,
    },
    // Intensité/Taille de l'étoile
    intensity: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium',
    },
    // Date du souvenir
    date: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index pour récupérer rapidement les étoiles d'un utilisateur
StarSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Star', StarSchema);
