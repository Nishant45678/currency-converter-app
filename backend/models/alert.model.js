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
    condition: {
      type: String,
      required: true,
      enum: ["<", ">", "="],
    },
    threshold: {
      type: Number,
      required: true,
    },
    hasDelivered:{
      type:Boolean,
      default:false
    },
    wantDailyUpdates: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
schema.index({from:1,to:1,condition:1,threshold:1,userId:1},{unique:true})

const alertModel = model("Alert", schema);

export default alertModel;
