import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generalToken = (payload: any): string => {
    const token = jwt.sign({ ...payload }, process.env.JWT_SECRET as any, { expiresIn: '24h' });
    return 'Bearer ' + token;
};

export const refreshToken = (payload: any): string => {
    const token = jwt.sign({ ...payload }, process.env.JWT_SECRET as any, { expiresIn: '365d' });
    return 'Bearer ' + token;
};

export const verifyToken = (token: string): any => {
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET as any);
        return decoded;
    } catch (error) {
        console.error('JWT verification error:', error);
        throw {
            status: 401,
            message: 'Invalid token',
        };
    }
};

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwt.decode(token.replace('Bearer ', '')) as { exp?: number };

        if (!decoded?.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return true;
    }
};
