import { Router } from "express";
import { isAuthenticated } from "../middleware/index.js";

const router = Router();

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { fromDate, toDate, fromCurrency, toCurrency } = req.body;
    if (!fromCurrency || !fromDate || !toCurrency || !toDate)
      return res.status(400).json({ message: "All fields are required" });
    const response = await fetch(
      `https://api.frankfurter.dev/v1/${fromDate}..${toDate}?base=${fromCurrency}&symbols=${toCurrency}`
    );
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
});

export { router as historyRouter };
