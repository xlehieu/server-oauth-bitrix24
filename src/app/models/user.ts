import mongoose from 'mongoose';

export interface IUser {
    member_id: string;
    domain: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    obtained_at: number;
    name?: string;
    password?: string;
    email?: string;
}
const UserSchema = new mongoose.Schema<IUser>(
    {
        member_id: String,
        domain: String,
        access_token: String,
        refresh_token: String,
        expires_in: Number,
        obtained_at: Number,
        name: String,
        password: String,
        email: String,
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        bufferCommands: true,
    },
);

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
