import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export default function corsMiddleware(req: Request, res: Response, next: NextFunction): any {
    // if (!req.headers.origin || !(req.headers.origin == process.env.ALLOW_ORIGIN))
    //     return res.status(404).json({ message: 'No origin' });
    //DOMAIN BITRIX DOMAIN=xuanhieu.bitrix24.vn
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim());
    const requestOrigin = req.headers.origin;
    console.log('=>>>>>>>>>>>>>>>>>Origin:', requestOrigin);

    console.warn(
        "requestOrigin && (allowedOrigins.includes(requestOrigin) || requestOrigin.includes('bitrix24'))",
        requestOrigin && (allowedOrigins.includes(requestOrigin) || requestOrigin.includes('bitrix24')),
    );
    // Luôn cần kiểm tra nếu có origin
    if (requestOrigin && (allowedOrigins.includes(requestOrigin) || requestOrigin.includes('bitrix24'))) {
        res.setHeader('Access-Control-Allow-Origin', requestOrigin);
        console.log('Set Access-Control-Allow-Origin to:', requestOrigin);
    } else return res.status(403).json({ message: 'Origin not allowed' });
    res.setHeader('Vary', 'Origin'); // Giúp trình duyệt xử lý cache CORS đúng cách
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // ✅ Cho phép gửi credentials
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours in seconds
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
}
