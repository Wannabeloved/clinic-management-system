import express from "express";
import * as applicationController from "../controllers/applicationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { page, limit, search, sortField, sortOrder } = req.query;

    const result = await applicationController.getApplications({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || "",
      sortField: sortField || "createdAt",
      sortOrder: sortOrder || "desc",
    });

    // Если это AJAX-запрос, возвращаем только таблицу
    if (req.xhr) {
      return res.render("applications", {
        applications: result.applications,
        currentPage: result.pagination.currentPage,
        pages: result.pagination.pages,
        search,
        sortField,
        sortOrder,
        layout: false,
      });
    }

    // Для обычного запроса возвращаем полную страницу
    res.render("applications", {
      applications: result.applications,
      currentPage: result.pagination.currentPage,
      pages: result.pagination.pages,
      search,
      sortField,
      sortOrder,
    });
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    res.status(500).render("error", { error: "Ошибка при получении заявок" });
  }
});

router.post("/submit", async (req, res) => {
  try {
    await applicationController.createApplication(req.body);
    res.render("submit-form", {
      title: "Отправить заявку",
      success: true,
    });
  } catch (error) {
    console.error("Ошибка при сохранении заявки:", error);
    res.render("submit-form", {
      title: "Отправить заявку",
      error: "Ошибка при сохранении заявки",
    });
  }
});

router.post("/:id/status", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await applicationController.updateApplicationStatus(id, status);

    // Если это AJAX-запрос, возвращаем JSON
    if (req.xhr) {
      return res.json({ success: true });
    }

    // Для обычного запроса делаем редирект обратно
    const returnUrl = req.get("Referer") || "/applications";
    res.redirect(returnUrl);
  } catch (error) {
    console.error("Ошибка при обновлении статуса:", error);
    if (req.xhr) {
      return res.status(500).json({ error: "Ошибка при обновлении статуса" });
    }
    res.status(500).render("error", { error: "Ошибка при обновлении статуса" });
  }
});

export default router;
