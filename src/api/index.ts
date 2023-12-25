import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";
import hamariweb from "./hamariweb";
import bbcfetch from "./bbcfetch";
import test from "./test";

const router = express.Router();

router.get<{}, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});
router.use("/emojis", emojis);
router.use("/hamariweb", hamariweb);
router.use("/bbc", bbcfetch);
router.use("/test", test);
export default router;
