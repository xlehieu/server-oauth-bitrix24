import mongoose from 'mongoose';

export interface IUser {
    name: string;
    password: string;
    email: string;
}
const UserSchema = new mongoose.Schema<IUser>(
    {
        name: String,
        password: String,
        email: String,
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        bufferCommands: true,
    },
);

const UserModel = mongoose.model<IUser>('User', UserSchema, 'User');
export default UserModel;
