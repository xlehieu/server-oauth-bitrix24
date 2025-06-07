import { Request, Response } from 'express';
// import * as AuthService from '../services/auth.service';
import * as AuthServiceBitrix from '../services/authBitrix.service';
export const installBitrix = async (req: Request, res: Response): Promise<any> => {
    try {
        const response_url = await AuthServiceBitrix.installBitrix(req);
        return res.redirect(302, response_url);
    } catch (error: any) {
        console.error('Error in authInstall:', error);
        return res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
};
