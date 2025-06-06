import { Router } from "express";
import axios from "axios";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

const apiRouter = Router();

apiRouter.post("/call", async (req, res) => {
  const { method, payload } = req.body;

  const tokens = JSON.parse(fs.readFileSync("token.json", "utf8"));
  const { access_token, domain } = tokens;

  try {
    const response = await axios.post(`https://${domain}/rest/${method}`, payload, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "API call failed" });
  }
});

export default apiRouter;
