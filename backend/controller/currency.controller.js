import NodeCache from "node-cache";
import sendError from "../utils/sendError.util.js";

const cache = new NodeCache({ stdTTL: 180 });

const conversionHandler = (isReverse) => {
  return async (req, res,next) => {
    try {
      let { amount, from, to, date} = req.body;
      date ??= new Date().toISOString().split("T")[0]
      if (!amount || !from || !to )
        return next(sendError("All fields are required.",400));

      if (cache.has(`${from}_${to}`)) {
        const { rate, date } = cache.get(`${from}_${to}`);
        const convertedAmount = isReverse ? amount * (1 / rate) : amount * rate;
        if (isReverse) [from, to] = [to, from];
        return res
          .status(200)
          .json({
            from,
            to,
            date,
            originalAmount: amount,
            convertedAmount: convertedAmount.toFixed(2),
          });
      }
      if (isReverse) [from, to] = [to, from];
      const response = await fetch(
        `https://api.frankfurter.dev/v1/${date}?amount=${amount}&base=${from}&symbols=${to}`
      );
      if (!response.ok)
        return next(sendError("failed to fetch exchange rate.",502))
          
      const data = await response.json();
      const convertedAmount = data.rates[to];

      cache.set(`${from}_${to}`, { rate: convertedAmount / amount, date });

      return res.status(200).json({
        from,
        to,
        date,
        originalAmount: amount,
        convertedAmount:convertedAmount.toFixed(2),
      });
    } catch (error) {
      return next(error);
    }
  };
};

const getAllCurrencies = async (req,res,next)=>{
  try {
    const response = await fetch("https://api.frankfurter.dev/v1/currencies");
    if(!response.ok) return sendError("failed to fetch currencies.",500)
    const data = await response.json()
    return res.status(200).json({data})
  } catch (error) {
    return next(error)
  }
}

export { conversionHandler,getAllCurrencies };
