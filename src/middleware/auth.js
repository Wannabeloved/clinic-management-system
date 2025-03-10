export const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    if (req.xhr) {
      // Для AJAX-запросов возвращаем 401 статус
      res.status(401).json({ error: "Unauthorized" });
    } else {
      // Для обычных запросов делаем редирект
      res.redirect("/login");
    }
  }
};
