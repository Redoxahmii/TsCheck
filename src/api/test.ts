import express from "express";
import { HTMLextract } from "../utils/BbcExtract";
const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    await HTMLextract();
    res.json({ message: "function ran successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});

export default router;
