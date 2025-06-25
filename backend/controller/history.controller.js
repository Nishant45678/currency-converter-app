import sendError from "../utils/sendError.util";

const getHistoryCurrency = async (req, res, next) => {
  try {
    let { fromDate, toDate, fromCurrency, toCurrency } = req.body;
    toDate ??= new Date();
    if (!fromCurrency || !fromDate || !toCurrency)
      return next(sendError("All fields are required", 400));
    const response = await fetch(
      `https://api.frankfurter.dev/v1/${fromDate}..${toDate}?base=${fromCurrency}&symbols=${toCurrency}`
    );
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

export { getHistoryCurrency };
