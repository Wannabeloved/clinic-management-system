import test from "node:test";
import assert from "node:assert/strict";
import { formatPhoneNumber } from "./phoneFormatter.js";

test("форматирование телефонных номеров", async t => {
  await t.test("форматирует номер, начинающийся с 8", () => {
    const result = formatPhoneNumber("89991234567");
    assert.equal(result, "+7 (999) 123-45-67");
  });

  await t.test("форматирует номер, начинающийся с +7", () => {
    const result = formatPhoneNumber("+79991234567");
    assert.equal(result, "+7 (999) 123-45-67");
  });

  await t.test("форматирует номер без кода страны, начинающийся с 9", () => {
    const result = formatPhoneNumber("9991234567");
    assert.equal(result, "+7 (999) 123-45-67");
  });

  await t.test("форматирует номер без кода страны, начинающийся с 8", () => {
    const result = formatPhoneNumber("8991234567");
    assert.equal(result, "+7 (991) 234-56-7");
  });

  await t.test("форматирует номер с пробелами и дефисами", () => {
    const result = formatPhoneNumber("+7 999 123-45-67");
    assert.equal(result, "+7 (999) 123-45-67");
  });

  await t.test("форматирует номер с разными разделителями", () => {
    const result = formatPhoneNumber("8 (999) 123.45.67");
    assert.equal(result, "+7 (999) 123-45-67");
  });

  await t.test("форматирует номер в формате +7(XXX)XXX-XX-XX", () => {
    const result = formatPhoneNumber("+7(953)071-88-55");
    assert.equal(result, "+7 (953) 071-88-55");
  });

  await t.test("форматирует номер в формате 7-XXX-XXX-XX-XX", () => {
    const result = formatPhoneNumber("7-953-071-88-55");
    assert.equal(result, "+7 (953) 071-88-55");
  });

  await t.test("выбрасывает ошибку при неверной длине номера", () => {
    assert.throws(() => formatPhoneNumber("123456789"), {
      message: "Некорректный формат номера телефона",
    });
  });

  await t.test("выбрасывает ошибку при пустом номере", () => {
    assert.throws(() => formatPhoneNumber(""), {
      message: "Некорректный формат номера телефона",
    });
  });

  await t.test("выбрасывает ошибку при отсутствии цифр", () => {
    assert.throws(() => formatPhoneNumber("abc"), {
      message: "Номер телефона должен содержать цифры",
    });
  });

  await t.test("выбрасывает ошибку при наличии букв", () => {
    assert.throws(() => formatPhoneNumber("8999abc4567"), {
      message: "Номер телефона содержит недопустимые символы",
    });
  });

  await t.test("заменяет первую цифру на 7 если длина верная", () => {
    const result = formatPhoneNumber("19991234567");
    assert.equal(result, "+7 (999) 123-45-67");
  });

  await t.test("форматирует номер с кодом города без кода страны", () => {
    const result = formatPhoneNumber("4991234567");
    assert.equal(result, "+7 (499) 123-45-67");
  });
});
