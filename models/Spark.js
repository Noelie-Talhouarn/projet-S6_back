import mongoose from "mongoose";

const sparkSchema = new mongoose.Schema({
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
