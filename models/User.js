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
  preferences_voyage: {
    type: String, // Ou Array si tu préfères
    default: null
  },
  date_creation: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('User', UserSchema);