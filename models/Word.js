import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true, // Pas de doublons
        trim: true,
        uppercase: true // On stocke tout en majuscule pour l'uniformité
    },
    theme: {
        type: String,
        enum: ['calme', 'joie', 'nature', 'lumière', 'douceur', 'mystère', 'espoir', 'beauté'],
        default: 'douceur'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Word', WordSchema);
