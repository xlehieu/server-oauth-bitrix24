declare global {
    namespace Express {
        interface Request {
            user_info?: any;
        }
    }
}
export {};
