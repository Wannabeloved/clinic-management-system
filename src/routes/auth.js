import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.get("/login", (req, res) => {
  const result = authController.renderLoginPage(req.session.userId);
  if (result.redirect) {
    res.redirect(result.redirect);
  } else {
    res.render(result.render, result.data);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("login");
    const user = await authController.login(email, password);
    req.session.userId = user._id;
    console.log(req.session.userId);
    res.redirect("/applications");
  } catch (error) {
    console.log("error");
    res.render("login", { error: error.message });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

export default router;
