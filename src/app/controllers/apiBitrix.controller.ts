import { Request, Response } from 'express';
import * as ApiBitrix from '../services/apiBitrix.service';
import * as AuthBitrix from '../services/authBitrix.service';
export const callApiAnyBitrix = async (req: Request, res: Response): Promise<any> => {
    try {
        const { action, payload } = req.body;
        console.log('=>>>>>action', action);
        console.log('=>>>>>payload', payload);
        if (!action || !payload) throw { status: 400, message: 'Missing required fields' };
        const userInfo = req.user_info;
        console.log('=>>>>>userInfo', userInfo);
        const access_token_Bitrix = await AuthBitrix.getTokenBitrix(userInfo.member_id);
        const result = await ApiBitrix.anyApiOAuthBitrix({
            domain: userInfo.domain,
            action,
            payload,
            access_token: access_token_Bitrix,
            member_id: userInfo.member_id,
        });
        console.log(`====> DATA API ${action} :`, result);
        return res.status(200).json(result);
    } catch (error: any) {
        console.error('Error in callApiAnyBitrix:', error);
        return res.status(error.status || 500).json({ error: 'Internal Server Error' });
    }
};
