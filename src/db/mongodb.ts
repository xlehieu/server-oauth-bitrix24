import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.DATABASE_URI;
export async function connect() {
    try {
        console.log('Connecting to MongoDB with URI:', uri);
        await mongoose.connect(String(uri), {
            connectTimeoutMS: 60000, //timeout khi kết nối
            serverSelectionTimeoutMS: 60000, // Tăng thời gian chờ chọn server lên 30 giây
            socketTimeoutMS: 60000, // Tăng thời gian chờ socket
            bufferCommands: false,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}
