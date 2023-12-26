import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";
import hamariweb from "./hamariweb";
import bbc from "./bbc";
import test from "./test";
import tribune from "./tribune";

const router = express.Router();

router.get<{}, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/hamariweb", hamariweb);
router.use("/bbc", bbc);
router.use("/test", test);
router.use("/tribune", tribune);

export default router;
