import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generalToken = (payload: any): string => {
    const token = jwt.sign({ ...payload }, process.env.JWT_SECRET as any, { expiresIn: '24h' });
    return 'Bearer ' + token;
};
