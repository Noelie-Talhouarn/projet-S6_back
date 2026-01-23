import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true, // "coloriage", "rythme", "camera"
        enum: ["coloriage", "rythme", "camera", "puzzle"],
    },
    description: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: false,
    },
    difficulty: {
        type: Number,
        min: 1, // 1 = Très très doux
        max: 3, // 3 = Un peu plus d'attention requise
        default: 1,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Game", gameSchema);
