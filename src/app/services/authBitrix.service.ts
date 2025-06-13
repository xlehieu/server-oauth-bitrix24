import { Request } from 'express';
import axios from 'axios';
import UserModel from '../models/user';
export const installBitrix = async (req: Request): Promise<any> => {
    try {
        //AUTH_ID là access_token
        //REFRESH_ID là refresh_token
        //AUTH_EXPIRES là thời gian hết hạn của access_token tính bằng giây
        //Định dạng :

        const { AUTH_ID, REFRESH_ID, AUTH_EXPIRES, member_id } = req.body;
        const { DOMAIN, APP_SID } = req.query;

        if (!DOMAIN || !APP_SID || typeof DOMAIN !== 'string') {
            throw {
                status: 400,
                message: 'Missing required query',
            };
        }
        const tokenData = {
            access_token: AUTH_ID,
            refresh_token: REFRESH_ID,
            expires_in: parseInt(AUTH_EXPIRES, 10), //chuyển về hệ thập phân
            obtained_at: Math.floor(Date.now() / 1000), //timestamp hiện tại
        };
        await saveTokenBitrix({
            member_id,
            domain: DOMAIN,
            tokenData,
        });
        // Redirect hoặc trả về iframe content cho frontend
        const frontendUrl = `${process.env.DEVELOPMENT ? 'http://localhost:3000' : process.env.FRONTEND_URL}/bitrix/auth?member_id=${member_id}`;
        console.log(`Redirecting to frontend URL: ${frontendUrl}`);
        return frontendUrl;
    } catch (error) {
        console.error('Error in authInstall:', error);
        throw error; // Hoặc xử lý lỗi theo cách khác
    }
};

const saveTokenBitrix = async ({ member_id, domain, tokenData }: { member_id: string; domain: string; tokenData: any }) => {
    try {
        let user = await UserModel.findOne({ member_id });
        console.log('USER BITRIX 24: ', user);
        // member_id là id của user đặt làm field khóa luôn
        if (!user) {
            user = new UserModel({
                member_id,
                domain,
                ...tokenData,
            });
        } else {
            Object.assign(user, tokenData);
        }
        await user.save();
        return user;
    } catch (error) {
        console.error('Error saving token:', error);
        throw {
            status: 500,
            message: 'Failed to save token',
        };
    }
};
export const getTokenBitrix = async (member_id: string) => {
    try {
        let user = await UserModel.findOne({ member_id });
        if (!user) {
            throw {
                status: 404,
                message: 'User not found',
            };
        }

        const now = Math.floor(Date.now() / 1000);
        const expired = now > user.obtained_at + user.expires_in - 60;

        if (!expired) return user.access_token;
        console.error('client_id', process.env.BITRIX_CLIENT_ID!);
        console.error('client_sceret', process.env.BITRIX_CLIENT_SECRET!);
        //https://oauth.bitrix.info/oauth/token/?grant_type=refresh_token&client_id=local.6840f32c4595b6.11637008&client_secret=RWwFsClBMjCBns7r63TPu9Pl6o4yRncrv7Ef3W0XothoPqcNpa&refresh_token=eeea6d6800792fa3007927a500000001403807539ca4ccde9f8852a044f00c591e56cd
        const res = await axios.get('https://oauth.bitrix.info/oauth/token', {
            params: {
                grant_type: 'refresh_token',
                client_id: process.env.BITRIX_CLIENT_ID!,
                client_secret: process.env.BITRIX_CLIENT_SECRET!,
                refresh_token: user.refresh_token,
            },
        });
        console.log('RES OAUTH BITRIX TOKEN REFRESH: ', res.data);
        const newToken = res.data;

        // user = {
        //     ...user,
        //     refresh_token: newToken.refresh_token,
        //     access_token: newToken.access_token,
        //     obtained_at: Math.floor(Date.now() / 1000),
        // };
        user.refresh_token = newToken.refresh_token;
        user.access_token = newToken.access_token;
        user.obtained_at = Math.floor(Date.now() / 1000);
        console.warn('USER BITRIX 24: ', user);
        await user.save();

        return newToken.access_token;
    } catch (err) {
        console.error('Error getTokenBitrix:', err);
        throw err;
    }
};
export const getUserBitrixByMemberId = async (member_id: string) => {
    try {
        if (!member_id)
            throw {
                status: 400,
                message: 'Missing required query',
            };
        const user = await UserModel.findOne({ member_id });
        if (!user)
            throw {
                status: 404,
                message: 'User not found',
            };
        return user;
    } catch (err) {
        throw err;
    }
};
//ví dụ gọi API Bitrix24
// BX24.callMethod(
//     'ai.engine.register',
//     {
//         name: 'Johnson GPT',
//         code: 'johnson_gpt',
//         category: 'text',
//         completions_url: 'https://antonds.com/ai/aul/completions/',
//         settings: {
//             code_alias: 'ChatGPT',
//             model_context_type: 'token',
//             model_context_limit: 16*1024,
//         },
//     },
//     function(result)
//     {
//         if(result.error())
//         {
//             console.error(result.error());
//         }
//         else
//         {
//             console.info(result.data());
//         }
//     }
// );

// Example of how to call the Bitrix24 API
// curl -X POST \
//   -H "Content-Type: application/json" \
//   -d '{
//     "fields": {
//       "TITLE": "New Deal",
//       "TYPE_ID": "SALE",
//       "STAGE_ID": "NEW"
//     }
//   }' \
//   "https://xuanhieu.bitrix24.vn/rest/crm.deal.add.json?auth=access_token"
