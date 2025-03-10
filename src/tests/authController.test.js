import test from "node:test";
import assert from "node:assert/strict";
import { mockUser } from "./mocks.js";
import * as authController from "../controllers/authController.js";
import User from "../models/User.js";

// Мокаем модель User
User.findOne = async query => {
  if (query.email === mockUser.email) {
    return mockUser;
  }
  return null;
};

test("authController", async t => {
  await t.test("login() - успешный вход", async () => {
    const user = await authController.login(
      "test@example.com",
      "correct_password"
    );
    assert.equal(user._id, mockUser._id);
    assert.equal(user.email, mockUser.email);
  });

  await t.test("login() - неверный email", async () => {
    await assert.rejects(
      async () => {
        await authController.login("wrong@example.com", "correct_password");
      },
      {
        message: "Неверный email или пароль",
      }
    );
  });

  await t.test("login() - неверный пароль", async () => {
    await assert.rejects(
      async () => {
        await authController.login("test@example.com", "wrong_password");
      },
      {
        message: "Неверный email или пароль",
      }
    );
  });

  await t.test("renderLoginPage() - без userId", () => {
    const result = authController.renderLoginPage(null);
    assert.deepEqual(result, {
      render: "login",
      data: { error: null },
    });
  });

  await t.test("renderLoginPage() - с userId", () => {
    const result = authController.renderLoginPage("some_user_id");
    assert.deepEqual(result, {
      redirect: "/applications",
    });
  });
});
