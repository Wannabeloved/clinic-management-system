import test from "node:test";
import assert from "node:assert/strict";
import { mockApplication } from "./mocks.js";
import * as applicationController from "../controllers/applicationController.js";
import Application from "../models/Application.js";

// Мокаем модель Application
const applications = [mockApplication];

// Исправляем мок для корректной цепочки вызовов
Application.find = () => {
  const query = {
    sort: function () {
      return {
        skip: function () {
          return {
            limit: function () {
              return Promise.resolve(applications);
            },
          };
        },
      };
    },
  };
  return query;
};

Application.countDocuments = async () => 1;
Application.findByIdAndUpdate = async (id, update) => {
  if (id === mockApplication._id) {
    return { ...mockApplication, ...update };
  }
  return null;
};

test("applicationController", async t => {
  await t.test("getApplications() - базовый случай", async () => {
    const result = await applicationController.getApplications({});
    assert.equal(result.applications.length, 1);
    assert.equal(result.pagination.total, 1);
    assert.equal(result.pagination.currentPage, 1);
  });

  await t.test("getApplications() - с параметрами", async () => {
    const result = await applicationController.getApplications({
      page: 2,
      limit: 5,
      search: "тест",
      sortField: "fullName",
      sortOrder: "asc",
    });
    assert.equal(result.applications.length, 1);
    assert.equal(result.pagination.currentPage, 2);
  });

  await t.test("createApplication() - успешное создание", async () => {
    // Мокаем save
    const savedApplication = { ...mockApplication };
    Application.prototype.save = async function () {
      return savedApplication;
    };

    const newApplication = await applicationController.createApplication({
      fullName: "Тест Тестов",
      phoneNumber: "+7 (999) 888-77-66",
      problemDescription: "Новая проблема",
    });

    assert.ok(newApplication);
  });

  await t.test("updateApplicationStatus() - успешное обновление", async () => {
    const updatedApplication =
      await applicationController.updateApplicationStatus(
        mockApplication._id,
        "in_progress"
      );

    assert.equal(updatedApplication.status, "in_progress");
  });

  await t.test("updateApplicationStatus() - заявка не найдена", async () => {
    await assert.rejects(
      async () => {
        await applicationController.updateApplicationStatus(
          "wrong_id",
          "completed"
        );
      },
      {
        message: "Заявка не найдена",
      }
    );
  });
});
