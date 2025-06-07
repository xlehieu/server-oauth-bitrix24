import 'tsconfig-paths/register';
import { Application } from 'express';
import apiRouter from './apiBitrix.routes';
import authRouter from './auth.routes';
import authBitrixRouter from './authBitrix.routes';
const routes = function (app: Application) {
    app.use('/api', apiRouter);
    app.use('/auth', authRouter);
    app.use('/bitrix-oauth', authBitrixRouter);
    console.log('Routes registered successfully!');
};
export default routes;
