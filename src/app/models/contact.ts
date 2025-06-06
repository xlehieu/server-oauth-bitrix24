import mongoose, { Types, Document } from 'mongoose';
const Schema = mongoose.Schema;

interface IContact{
    name: string;
    email: string;
    phone: string;
    address?: string;
    website?: string;
}

const ContactSchema = new Schema<IContact>(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        phone: { type: String, unique: true },
        address: { type: String },
        website: { type: String },
    },
    {
        timestamps: true,
    },
);
const Contact: mongoose.Model<IContact> = mongoose.model<IContact>('contact', ContactSchema);

export default Contact;
