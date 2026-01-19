import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: String, // Format YYYY-MM-DD pour facile la rechere par jour
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Quote', QuoteSchema);
