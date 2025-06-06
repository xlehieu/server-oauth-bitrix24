import { Router } from "express";
import axios from "axios";
import * as AuthController from "../app/controllers/auth.controller";
import dotenv from 'dotenv';
dotenv.config();

const authRouter = Router();
authRouter.post('/install', AuthController.authInstall);

// authRouter.post("/install", async (req, res):Promise<any> => {
//   const { code, domain } = req.body;
//   console.log("==== Received POST request with body:", req.body);
//   console.log("==== Received POST request with query:", req.query);
//   // fallback nếu Bitrix gửi query string thay vì body
//   const query = req.query;
//   const _code = code || query.code;
//   const _domain = domain || query.domain;
//   console.log("==== Code:", _code);
//   console.log("==== Domain:", _domain);
//   if (!_code || !_domain) {
//     return res.status(400).send("❌ Missing code or domain");
//   }
//   // giống code GET bên bạn
//   try {
//     const response = await axios.post(`https://${_domain}/oauth/token/`, null, {
//       params: {
//         grant_type: "authorization_code",
//         client_id: process.env.CLIENT_ID,
//         client_secret: process.env.CLIENT_SECRET,
//         code: _code,
//         redirect_uri: process.env.REDIRECT_URI,
//       },
//     });

//     const tokens = { ...response.data, domain: _domain };
//     fs.writeFileSync("token.json", JSON.stringify(tokens, null, 2));
//     res.send("✅ App installed successfully!");
//   } catch (error: any) {
//     console.error(error.response?.data || error.message);
//     res.status(500).send("❌ Failed to install app");
//   }
// });

export default authRouter;
