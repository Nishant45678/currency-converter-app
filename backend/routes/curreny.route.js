import { Router } from "express";
import { conversionHandler, getAllCurrencies } from "../controller/currency.controller.js";

const router = Router();

router.post("/convert", conversionHandler(false));
router.post("/reverse", conversionHandler(true));
router.get("/currencies",getAllCurrencies)

export { router as currencyRouter };
