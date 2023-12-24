import express from "express";
import { Foo } from "../utils/FetchHamariWeb";
const router = express.Router();

type HamariResponse = {
  result: string;
};

router.get<{}, HamariResponse>("/", async (_req, res) => {
  const result = await Foo();
  res.json({ result: result });
});

export default router;
