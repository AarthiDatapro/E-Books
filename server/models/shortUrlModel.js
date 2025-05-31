import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
    shortKey: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    email: { type: String, required: true },

}, { timestamps: true });

const shortUrlModel = mongoose.model('shorturls', shortUrlSchema);

export default shortUrlModel;
