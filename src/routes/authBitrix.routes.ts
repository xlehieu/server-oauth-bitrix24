import { Router } from 'express';
import * as AuthBitrixController from '../app/controllers/authBitrix.controller';
import dotenv from 'dotenv';
dotenv.config();

const authBitrixRouter = Router();
authBitrixRouter.post('/install', AuthBitrixController.installBitrix);
// authRouter.post('/login', AuthController.login);
// authRouter.post('/register', AuthController.register);
// authRouter.get('/token', AuthController.getToken);
export default authBitrixRouter;
