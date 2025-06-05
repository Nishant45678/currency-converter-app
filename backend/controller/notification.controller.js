import sendError from "../utils/sendError.util.js";
import { Alert } from "../models/index.js";

const getAlerts = async (req, res, next) => {
  try {
    const data = await Alert.find({ userId: req.user._id });
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

const postAlerts = async (req, res, next) => {
  try {
    const { from, to, condition, threshold, wantDailyUpdates } = req.body;
    const { _id } = req.user;
    if (!from || !to || !condition || !threshold)
      return next(sendError("All fields are required.", 400));
    const newAlert = new Alert({
      from,
      to,
      condition,
      threshold,
      wantDailyUpdates,
      userId: _id,
    });
    await newAlert.save();
    return res
      .status(201)
      .json({ message: "Alert has been set everyday at 8 AM." });
  } catch (error) {
    return next(error);
  }
};

export { getAlerts, postAlerts };
