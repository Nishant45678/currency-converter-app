import { Router } from "express";
import { getHistoryCurrency } from "../controller/history.controller.js";

const router = Router();

router.post("/", getHistoryCurrency);

export { router as historyRouter };
