import mongoose from 'mongoose';

const LueurSchema = new mongoose.Schema({
    id_technique: {
        type: String,
        required: true,
        unique: true
    },
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image_url: {
        type: String,
        required: true
    },
    // Données pour le rendu CSS côté Frontend (optionnel en plus de l'image)
    couleur_principale: {
        type: String,
        required: true
    },
    couleur_secondaire: {
        type: String
    },
    intensite: {
        type: Number,
        default: 0.8
    },
    type_animation: {
        type: String,
        enum: ['pulse', 'float', 'breathe', 'none'],
        default: 'pulse'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Lueur', LueurSchema);
