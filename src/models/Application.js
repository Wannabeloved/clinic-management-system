import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  problemDescription: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["new", "in_progress", "completed", "cancelled"],
    default: "new",
  },
});

// Создаем индексы для поиска
applicationSchema.index({ fullName: "text", problemDescription: "text" });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
