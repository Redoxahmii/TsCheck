import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cron from "node-cron";

import * as middlewares from "./middlewares";
import { tribuneTypes } from "./interfaces/tribuneResponse";
import api from "./api";
import MessageResponse from "./interfaces/MessageResponse";
import { BbcExtract } from "./utils/BbcExtract";
import { FetchHamariWeb } from "./utils/FetchHamariWeb";
import { fetchTribune } from "./utils/fetchTribune";

require("dotenv").config();
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "hate life",
  });
});

app.use("/api/", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

cron.schedule("0 */2 * * *", async () => {
  try {
    await BbcExtract();
    console.log("BBC articles added!");
  } catch (error) {
    console.log(error);
  }
  try {
    await FetchHamariWeb();
    console.log("HamariWeb articles added!");
  } catch (error) {
    console.log(error);
  }
  try {
    tribuneTypes.forEach((type) => fetchTribune(type.param));
  } catch (error) {
    console.log(error);
  }
});

export default app;
