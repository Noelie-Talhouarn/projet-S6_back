import mongoose from 'mongoose';

const GameProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    // Données flexibles selon le jeu (ex: calque de coloriage, score, etc.)
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // État global
    status: {
        type: String,
        enum: ['started', 'in_progress', 'completed'],
        default: 'started'
    },
    lastPlayed: {
        type: Date,
        default: Date.now
    }
});

// Un utilisateur ne peut avoir qu'une seule sauvegarde par jeu (pour l'instant)
GameProgressSchema.index({ user: 1, game: 1 }, { unique: true });

export default mongoose.model('GameProgress', GameProgressSchema);
