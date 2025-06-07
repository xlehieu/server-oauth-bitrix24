import { Request, Response } from 'express';
import * as ApiBitrix from '../services/apiBitrix.service';
import * as AuthBitrix from '../services/authBitrix.service';
export const callApiAnyBitrix = async (req: Request, res: Response): Promise<any> => {
    try {
        const { action, payload } = req.body;
        if (!action || !payload) throw { status: 400, message: 'Missing required fields' };
        const userInfo = req.user_info;
        const userBitrix = await AuthBitrix.getUserBitrixByMemberId(userInfo.member_id);
        const result = await ApiBitrix.anyApiOAuthBitrix({
            domain: userInfo.domain,
            action,
            payload,
            access_token: userBitrix.access_token,
        });
        return res.status(200).json(result);
    } catch (error: any) {
        console.error('Error in callApiAnyBitrix:', error);
        return res.status(error.status || 500).json({ error: 'Internal Server Error' });
    }
};
