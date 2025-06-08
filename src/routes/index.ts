import 'tsconfig-paths/register';
import { Application } from 'express';
import apiBitrixRouter from './apiBitrix.routes';
import authRouter from './auth.routes';
import authBitrixRouter from './authBitrix.routes';
import * as TokenMiddleware from '../app/middlewares/jwt.middleware';
const routes = function (app: Application) {
    app.use('/bitrix-oauth', authBitrixRouter); // install app bitrix
    app.use('/api', TokenMiddleware.verifyToken, apiBitrixRouter); // gọi api bitrix
    app.use('/auth', authRouter); // lấy token
    console.log('Routes registered successfully!');
};
export default routes;
