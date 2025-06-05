import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    originalAmount: {
      type: Number,
      required: true,
    },
    convertedAmount: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    unique: true,
  }
);

const favouriteModel = model("Favourite", schema);

export default favouriteModel;
