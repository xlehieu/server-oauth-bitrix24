import * as jwt from 'jsonwebtoken';
export const verifyToken = (req: any, res: any, next: any): void => {
    const token = req.headers.authorization?.split(' ')[1];
    console.error('TOKEN MIDDLEWARE', token);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload & { member_id: string; domain: string };
        console.log('Decoded token verify:', decoded); // Log decoded token for debugging
        if (!decoded.member_id || !decoded.domain) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user_info = decoded; // Attach user info to request object
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
