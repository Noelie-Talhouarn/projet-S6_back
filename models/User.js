import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  prenom: {
    type: String,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mot_de_passe: {
    type: String,
    required: true,
  },
  // Avatar de l'utilisateur (URL ou chemin)
  avatar: {
    type: String,
    default: '',
  },
  // Préférences utilisateur pour personnaliser l'expérience
  preferences: {
    notifications: {
      type: Boolean,
      default: true,
    },
    daily_quote: {
      type: Boolean,
      default: true,
    },
    dark_mode: {
      type: Boolean,
      default: true,
    },
  },
  // Émotion actuelle de l'utilisateur
  emotion: {
    type: String,
    enum: ['anxious', 'tired', 'calm', 'joyful'],
    default: null
  },
  // Niveau de progression du jeu Mandala
  mandalaLevel: {
    type: Number,
    default: 1
  },
  // Niveau de progression du jeu Puzzle
  puzzleLevel: {
    type: Number,
    default: 1
  },
  // ✨ Favoris de l'utilisateur (Citations et Méditations)
  favorites: {
    // Citations favorites avec leur auteur et date d'ajout
    quotes: [{
      citation: { type: String, required: true },
      auteur: { type: String, default: 'Inconnu' },
      addedAt: { type: Date, default: Date.now }
    }],
    // IDs des méditations favorites (peut être String ou Number)
    meditationIds: [{ type: mongoose.Schema.Types.Mixed }]
  },
  // Statistiques utilisateur (Globales et Hebdomadaires)
  stats: {
    global: {
      stars_count: { type: Number, default: 0 },
      breathing_sessions_count: { type: Number, default: 0 },
      games_played_count: { type: Number, default: 0 }
    },
    weekly: {
      week_number: { type: Number, default: 0 },
      year: { type: Number, default: 0 },
      stars_count: { type: Number, default: 0 },
      breathing_sessions_count: { type: Number, default: 0 },
      games_played_count: { type: Number, default: 0 }
    }
  },
  // Champs pour la réinitialisation du mot de passe (La lueur de secours)
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  // Date d'inscription de l'utilisateur
  date_inscription: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', UserSchema);