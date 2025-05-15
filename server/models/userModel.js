import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        role: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: Number, required: true, unique: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        password: { type: String, required: true, min: 8, max: 20 },
        shortUrl: { type: String, required: true },
        commission: { type: Number, default: 0 },
    }
)


const userModel = mongoose.model("users", userSchema);

export default userModel;