import { Router } from "express";
import { conversionHandler } from "../controller/currency.controller.js";
import sendError from "../utils/sendError.util.js";

const router = Router();

router.post("/convert", conversionHandler(false));
router.post("/reverse", conversionHandler(true));
router.get("/currencies",async (req,res,next)=>{
  try {
    const response = await fetch("https://api.frankfurter.dev/v1/currencies");
    if(!response.ok) return sendError("failed to fetch currencies.",500)
    const data = await response.json()
    return res.status(200).json({data})
  } catch (error) {
    return next(error)
  }
})

export { router as currencyRouter };
