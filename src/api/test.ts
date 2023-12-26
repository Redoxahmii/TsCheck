import express from "express";
import { BbcExtract } from "../utils/BbcExtract";
const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    await BbcExtract();
    res.json({ message: "function ran successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});

export default router;
