import mongoose from 'mongoose';

export interface IUserBitrix {
    member_id: string;
    domain: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    obtained_at: number;
}
const UserSchema = new mongoose.Schema<IUserBitrix>(
    {
        member_id: String,
        domain: String,
        access_token: String,
        refresh_token: String,
        expires_in: Number,
        obtained_at: Number,
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
        bufferCommands: true,
    },
);

const UserBitrixModel = mongoose.model<IUserBitrix>('UserBitrix', UserSchema, 'UserBitrix');
export default UserBitrixModel;
