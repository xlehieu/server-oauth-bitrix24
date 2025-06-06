import { Request } from 'express';
import UserModel, { IUser } from '../models/user';
import * as JWTService from './jwt.service';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const SALT_BCRYPT = bcrypt.genSaltSync(10);

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
            expires_in: parseInt(AUTH_EXPIRES, 10),
            obtained_at: Math.floor(Date.now() / 1000),
        };
        await saveToken({
            member_id,
            domain: DOMAIN,
            tokenData,
        });
        // Redirect hoặc trả về iframe content cho frontend
        const frontendUrl = `${process.env.FRONTEND_URL}/bitrix?DOMAIN=${DOMAIN}&APP_SID=${APP_SID}`;
        console.log(`Redirecting to frontend URL: ${frontendUrl}`);
        return {
            status: 302,
            location: frontendUrl,
        };
    } catch (error) {
        console.error('Error in authInstall:', error);
        throw error; // Hoặc xử lý lỗi theo cách khác
    }
};

const saveToken = async ({ member_id, domain, tokenData }: { member_id: string; domain: string; tokenData: any }) => {
    let user = await UserModel.findOne({ member_id, domain });
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
};

const getTokenBitrix24 = async (key: string) => {
    const user = await UserModel.findOne({ member_id: key });
    if (!user) {
        throw new Error('Token not found');
    }
    return user;
};

const getValidTokenBitrix24 = async (key: string, domain: string, member_id: string) => {
    let token = await getTokenBitrix24(key);
    const now = Math.floor(Date.now() / 1000);
    const expired = now > token.obtained_at + token.expires_in - 60;

    if (!expired) return token.access_token;

    const res = await axios.post(
        'https://oauth.bitrix.info/oauth/token',
        new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.BITRIX_CLIENT_ID!,
            client_secret: process.env.BITRIX_CLIENT_SECRET!,
            refresh_token: token.refresh_token,
        }),
    );
    console.log('RES OAUTH BITRIX TOKEN REFRESH: ', res.data);
    const newToken = await res.data;

    await saveToken({
        member_id,
        domain,
        tokenData: {
            access_token: newToken.access_token,
            refresh_token: newToken.refresh_token,
            expires_in: newToken.expires_in,
            obtained_at: Math.floor(Date.now() / 1000),
        },
    });

    return newToken.access_token;
};
export const callBitrixAPI = async ({ userId, action, payload = {} }: any): Promise<any> => {
    const user: IUser | null = await UserModel.findOne({ member_id: userId });

    if (!user || !user.access_token || !user.domain) {
        throw new Error('User chưa kết nối Bitrix');
    }

    let accessToken = user.access_token;

    try {
        const response = await axios.get(`https://${user.domain}/rest/${action}`, {
            params: {
                auth: accessToken,
                ...payload,
            },
        });
        console.log('Response from Bitrix API:', response.data);
        return response.data;
    } catch (err: any) {
        // Nếu lỗi do token hết hạn → refresh token
        if (err.response?.data?.error === 'expired_token') {
            console.log('Access token hết hạn. Đang refresh...');

            const token = await getValidTokenBitrix24(userId, user.domain, user.member_id);

            // Retry lại
            const retryResponse = await axios.get(`https://${user.domain}/rest/${action}`, {
                params: {
                    auth: token,
                    ...payload,
                },
            });

            return retryResponse.data;
        }

        console.error('Lỗi gọi API Bitrix:', err?.response?.data || err.message);
        throw new Error('Gọi API Bitrix thất bại');
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

export const getUserInfo = async (req: Request): Promise<any> => {
    const { userId } = req.params;

    if (!userId) {
        throw {
            status: 400,
            message: 'Missing userId parameter',
        };
    }

    const user = await UserModel.findOne({ member_id: userId }).populate('name password email');

    if (!user) {
        throw {
            status: 404,
            message: 'User not found',
        };
    }

    return user;
};
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const checkValidEmail = (email: string): boolean => {
    if (!regex.test(email)) return false;
    return true;
};
export const register = async (req: Request): Promise<any> => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword) {
            throw {
                status: 400,
                message: 'Missing required fields',
            };
        }
        if (!checkValidEmail(email)) {
            throw {
                status: 400,
                message: 'Invalid email format',
            };
        }
        if (password !== confirmPassword) {
            throw {
                status: 400,
                message: 'Passwords do not match',
            };
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw {
                status: 409,
                message: 'Email already in use',
            };
        }
        const hash = bcrypt.hashSync(password, SALT_BCRYPT);
        const newUser = new UserModel({
            email,
            password: hash,
        });

        await newUser.save();

        return {
            status: 201,
            message: 'User registered successfully',
        };
    } catch (error) {
        console.error('Error in register service:', error);
        throw error;
    }
};
export const login = async (req: Request): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw {
                status: 400,
                message: 'Missing email or password',
            };
        }
        if (!checkValidEmail(email)) {
            throw {
                status: 400,
                message: 'Invalid email format',
            };
        }
        const user = await UserModel.findOne({ email }).populate('name password email');
        if (!user) {
            throw {
                status: 401,
                message: 'Invalid email or password',
            };
        }
        const isPasswordValid = bcrypt.compareSync(password, user!.password || '');
        if (!isPasswordValid) {
            throw {
                status: 401,
                message: 'Invalid email or password',
            };
        }
        const access_token: string = JWTService.generalToken({
            id: user!.id,
        });
        const responseData = {
            status: 200,
            message: 'Login successful',
            user: {
                ...user,
                access_token,
            },
        };
        console.log('INFORMATION USER RETURN: ', responseData);
        return responseData;
    } catch (error) {
        console.error('Error in login:', error);
        throw error;
    }
};
