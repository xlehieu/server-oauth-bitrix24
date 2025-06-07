import { Router } from 'express';
import * as AuthController from '../app/controllers/auth.controller';
import dotenv from 'dotenv';
dotenv.config();

const authRouter = Router();
authRouter.get('/token', AuthController.getAccessToken); // lấy access token từ BE cấp cho FE not Bitrix
// authRouter.post('/login', AuthController.login);
// authRouter.post('/register', AuthController.register);
export default authRouter;
