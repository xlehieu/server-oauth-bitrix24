import { Request } from 'express';
import UserModel from '../models/user';
import * as JWTService from './jwt.service';

// trả về cho FE
export const getAccessTokenBE = async (req: Request) => {
    try {
        const { member_id } = req.query;
        const user = await UserModel.findOne({ member_id });
        if (!user) {
            throw {
                status: 404,
                message: 'User not found',
            };
        }
        // dùng tạm cách này để lấy access_token do backend cấp
        // mỗi khi người dùng mở app Bitrix24 thì sẽ gọi API này để cấp lại access_token
        const access_token = JWTService.generalToken({ member_id: user.member_id, domain: user.domain });
        console.log('ACCESS TOKEN BE: ', access_token);
        return access_token;
    } catch (error) {
        throw error; // Hoặc xử lý lỗi theo cách khác
    }
};
// const SALT_BCRYPT = bcrypt.genSaltSync(10);
// export const getUserInfo = async (req: Request): Promise<any> => {
//     const { userId } = req.params;

//     if (!userId) {
//         throw {
//             status: 400,
//             message: 'Missing userId parameter',
//         };
//     }

//     const user = await UserModel.findOne({ member_id: userId }).populate('name password email');

//     if (!user) {
//         throw {
//             status: 404,
//             message: 'User not found',
//         };
//     }

//     return user;
// };
// const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const checkValidEmail = (email: string): boolean => {
//     if (!regex.test(email)) return false;
//     return true;
// };
// export const register = async (req: Request): Promise<any> => {
//     try {
//         const { email, password, confirmPassword, member_id } = req.body;

//         if (!email || !password || !confirmPassword) {
//             throw {
//                 status: 400,
//                 message: 'Missing required fields',
//             };
//         }
//         if (!checkValidEmail(email)) {
//             throw {
//                 status: 400,
//                 message: 'Invalid email format',
//             };
//         }
//         if (password !== confirmPassword) {
//             throw {
//                 status: 400,
//                 message: 'Passwords do not match',
//             };
//         }

//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             throw {
//                 status: 409,
//                 message: 'Email already in use',
//             };
//         }
//         const hash = bcrypt.hashSync(password, SALT_BCRYPT);
//         const findUserByMemberId = await UserModel.findOne({ member_id });
//         findUserByMemberId!.password = hash;
//         findUserByMemberId!.email = email;
//         await findUserByMemberId!.save();

//         return {
//             status: 201,
//             message: 'User registered successfully',
//         };
//     } catch (error) {
//         console.error('Error in register service:', error);
//         throw error;
//     }
// };
// export const login = async (req: Request): Promise<any> => {
//     try {
//         const { email, password,member_id } = req.body;

//         if (!email || !password) {
//             throw {
//                 status: 400,
//                 message: 'Missing email or password',
//             };
//         }
//         if (!checkValidEmail(email)) {
//             throw {
//                 status: 400,
//                 message: 'Invalid email format',
//             };
//         }
//         const user = await UserModel.findOne({ email }).populate('name password email');
//         if (!user) {
//             throw {
//                 status: 401,
//                 message: 'Invalid email or password',
//             };
//         }
//         const isPasswordValid = bcrypt.compareSync(password, user!.password || '');
//         if (!isPasswordValid) {
//             throw {
//                 status: 401,
//                 message: 'Invalid email or password',
//             };
//         }
//         const access_token: string = JWTService.generalToken({
//             id: user!.id,
//         });
//         const responseData = {
//             status: 200,
//             message: 'Login successful',
//             user: {
//                 ...user,
//                 access_token,
//             },
//         };
//         console.log('INFORMATION USER RETURN: ', responseData);
//         return responseData;
//     } catch (error) {
//         console.error('Error in login:', error);
//         throw error;
//     }
// };
