import test from "node:test";
import assert from "node:assert/strict";
import { requireAuth } from "../middleware/auth.js";

test("auth middleware", async t => {
  await t.test("requireAuth() - с авторизацией", () => {
    let nextCalled = false;
    const req = { session: { userId: "some_id" } };
    const res = {
      redirect: () => {
        throw new Error("Не должно вызываться");
      },
    };
    const next = () => {
      nextCalled = true;
    };

    requireAuth(req, res, next);
    assert.equal(nextCalled, true);
  });

  await t.test("requireAuth() - без авторизации", () => {
    let redirectPath = null;
    const req = { session: {} };
    const res = {
      redirect: path => {
        redirectPath = path;
      },
    };
    const next = () => {
      throw new Error("Не должно вызываться");
    };

    requireAuth(req, res, next);
    assert.equal(redirectPath, "/login");
  });
});
