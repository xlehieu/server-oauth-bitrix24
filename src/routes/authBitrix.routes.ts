import { Router } from 'express';
import * as AuthBitrixController from '../app/controllers/authBitrix.controller';
import dotenv from 'dotenv';
dotenv.config();

const authBitrixRouter = Router();
authBitrixRouter.post('/install', AuthBitrixController.installBitrix);
export default authBitrixRouter;
