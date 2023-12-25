import express from "express";
import { FetchHamariWeb } from "../utils/FetchHamariWeb";
const router = express.Router();

type HamariResponse = {
  data: string;
  message: string;
};

router.get<{}, HamariResponse>("/", async (_req, res) => {
  const result = await FetchHamariWeb();
  res.json({ message: "success", data: result });
});

export default router;
