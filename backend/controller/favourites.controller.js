import { Favourite } from "../models/index.js";
import sendError from "../utils/sendError.util.js";
const getFavourites = async (req, res,next) => {
  try {
    const data = await Favourite.find({ userId: req.user._id });
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

const postFavourite = async (req, res,next) => {
  try {
    const { from, to, date, originalAmount, convertedAmount } = req.body;
    const userId = req.user._id;

    if (!from || !to || !date || !originalAmount || !convertedAmount)
      return next(sendError("necessary fields are required.",400))
        

    const newFaurite = new Favourite({
      from,
      to,
      date,
      originalAmount,
      convertedAmount,
      userId,
    });

    await newFaurite.save();
    return res.status(201).json({ message: "favourite has been added." });
  } catch (error) {
    return next(error);
  }
};

const deleteFavourite = async (req, res,next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const deleted = await Favourite.findOneAndDelete({ _id: id, userId });
    if (!deleted)
      return next(sendError("Favourite not found",404)) 
    return res
      .status(200)
      .json({ message: "successfully removed from favourite list." });
  } catch (error) {
    return next(error);
  }
};

export { getFavourites, postFavourite, deleteFavourite };
