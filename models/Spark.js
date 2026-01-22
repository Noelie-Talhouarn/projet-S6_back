import mongoose from "mongoose";

const sparkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index pour optimiser les requêtes par utilisateur
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["message", "defi", "pensee"],
    default: "message",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Spark", sparkSchema);
