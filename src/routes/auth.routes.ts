import { Router } from 'express';
import axios from 'axios';
import * as AuthController from '../app/controllers/auth.controller';
import dotenv from 'dotenv';
dotenv.config();

const authRouter = Router();
authRouter.post('/install', AuthController.authInstall);

export default authRouter;
