import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
export const authInstall = async (req: Request, res: Response): Promise<any> => {
    try {
        const dataService = await AuthService.authInstall(req);
        return res.redirect(302, dataService.location);
    } catch (error: any) {
        console.error('Error in authInstall:', error);
        return res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const dataService = await AuthService.login(req);
        return res.status(200).json(dataService);
    } catch (error: any) {
        console.error('Error in login:', error);
        return res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
};

// export const logout = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const dataService = await AuthService.logout(req);
//         return res.status(200).send(dataService);
//     } catch (error: any) {
//         console.error('Error in logout:', error);
//         return res.status(error.status || 500).send(error.message || 'Internal Server Error');
//     }
// };

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
