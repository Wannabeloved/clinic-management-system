import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["operator"],
    default: "operator",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Хеширование пароля перед сохранением
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Метод для проверки пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("comparePasswords:", candidatePassword, this.password);
  // const isValid = await bcrypt.compare(candidatePassword, this.password);
  const isValid = (await candidatePassword) == this.password;
  return isValid;
};

const User = mongoose.model("User", userSchema);

export default User;
