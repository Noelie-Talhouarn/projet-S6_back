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
  // Ancienne préférence (conservée pour compatibilité)
  preferences_voyage: {
    type: String,
    default: null
  },
  // Date d'inscription de l'utilisateur
  date_inscription: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', UserSchema);