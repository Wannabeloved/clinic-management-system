import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";

// Импорт маршрутов
import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/express-mongo-db";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Подключаем MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Настройка шаблонизатора Pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware для передачи информации о пользователе в шаблоны
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId } : null;
  res.locals.path = req.path;
  next();
});

// Маршруты
app.get("/", (req, res) => {
  res.redirect("/submit-form");
});

app.get("/submit-form", (req, res) => {
  res.render("submit-form", { title: "Отправить заявку" });
});

app.use("/", authRoutes);
app.use("/applications", applicationRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
