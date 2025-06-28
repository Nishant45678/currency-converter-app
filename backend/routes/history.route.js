import { Router } from "express";
import { getTrendCurrency,getCurrentCurrency } from "../controller/history.controller.js";

const router = Router();

router.post("/trend", getTrendCurrency);
router.post("/current", getCurrentCurrency);

export { router as historyRouter };
