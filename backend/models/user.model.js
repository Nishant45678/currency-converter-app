import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";

const schema = new Schema({
  username: { type: String, required: true, unique: true, index:true},
  password: { type: String, required: true },
  email: { type: String, required: true },
},{
  timestamps:true,
});

schema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

schema.methods.verifyPassword = async function (password) {
  console.log(password,this.password)
  return await bcrypt.compare(password, this.password);
};

const userModel = model("User", schema);

export default userModel;
