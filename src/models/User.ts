import mongoose from "mongoose";
const { Schema } = mongoose;
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    minlength: 3,
    maxlength: 20,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please provide email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    min: 5,
    select: false,
  },
});

//crypt the password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//create jwt token
userSchema.methods.createJWT = function () {
  return jwt.sign({ email: this.email }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
//compare login password with crypted password
userSchema.methods.comparePassword = async function (userPassword: string) {
  const isMatch = await bcrypt.compare(userPassword, this.password);

  return isMatch;
};

export default mongoose.model("User", userSchema);
