import 'tsconfig-paths/register';
import { Application } from 'express';
import apiRouter from './api.routes';
import authRouter from './auth.routes';
const routes = function (app: Application) {
    app.use('/api', apiRouter);
    app.use('/auth', authRouter);

    console.log('Routes registered successfully!');
};
export default routes;
