import { compare, hash } from "bcryptjs";
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
    if (!this.isModified("password")) return;
    this.password = await hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

schema.methods.verifyPassword = async function (password) {
  return await compare(password, this.password);
};

const userModel = model("User", schema);

export default userModel;
