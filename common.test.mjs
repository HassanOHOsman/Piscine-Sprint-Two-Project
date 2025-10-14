
import { getDaysInMonth } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";


//(1) Test the functionality of getDaysInMonth

//Typical months cases
test("Return 31 days for July", () => {
  assert.equal(getDaysInMonth(2025, 6), 31);
});

test("Return 30 days for Nov", () => {
  assert.equal(getDaysInMonth(1985, 10), 30);
});

//Edge cases
test("Return 28 days for Feb in a non-leap year", () => {
  assert.equal(getDaysInMonth(2005, 1), 28);
});

test("Return 29 days for Feb in a leap year", () => {
  assert.equal(getDaysInMonth(2016, 1), 29);
});


