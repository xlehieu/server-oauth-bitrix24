import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
export const installBitrix = async (req: Request, res: Response): Promise<any> => {
    try {
        const dataService = await AuthService.installBitrix(req);
        return res.redirect(302, dataService.location);
    } catch (error: any) {
        console.error('Error in authInstall:', error);
        return res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const dataService = await AuthService.login(req);
        res.cookie('access_token', dataService.access_token, {
            httpOnly: true, // Không cho JavaScript truy cập, chống XSS
            secure: true, // Bật khi deploy trên HTTPS
            sameSite: 'none', // Ngăn chặn CSRF === cái này chưa tìm hiểu rõ
            maxAge: 1000 * 60 * 60 * 24, // Hết hạn sau 15 phút (hoặc tùy vào token)
        });
        return res.status(200).json({
            message: 'Login successful',
        });
    } catch (error: any) {
        console.error('Error in login:', error);
        return res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
};

export const getUserInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const dataService = await AuthService.getUserInfo(req);
        return res.status(200).send(dataService);
    } catch (error: any) {
        console.error('Error in getUserInfo:', error);
        return res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
};

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const dataService = await AuthService.register(req);
        return res.status(200).send(dataService);
    } catch (error: any) {
        console.error('Error in register:', error);
        return res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
};
