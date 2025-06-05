import { Router } from "express";
import { conversionHandler } from "../controller/currency.controller.js";

const router = Router();

router.post("/convert", conversionHandler(false));
router.post("/reverse", conversionHandler(true));

export { router as currencyRouter };
