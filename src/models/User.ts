import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    minLength: [3, "username must be at least 3 characters long"],
    maxLength: [12, "username must be less than 12 characters long"],
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
    required: [true, "Please provide password"],
    minLength: [5, "password must be at least 5 characters long"],
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
    expiresIn: process.env.JWT_LIFETIME as string,
  });
};
//compare login password with crypted password
userSchema.methods.comparePassword = async function (userPassword: string) {
  const isMatch = await bcrypt.compare(userPassword, this.password);

  return isMatch;
};

export default mongoose.model("User", userSchema);
