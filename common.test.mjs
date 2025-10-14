
import { getDaysInMonth } from "./common.mjs";
import { getEventDate } from "./populate-calendar.mjs"
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

//////////////////////////////////////////////////////////////////////////////////////////////


//(2) Test the functionality of getEventDate

//Recent event
test("Second Saturday of May 2025 falls on the 10th", () => {
  assert.equal(getEventDate(2025, "May", "Saturday", "second"), 10);
});

//Past event
test("Return the 17th for MLK Day (third Monday of January) in 2000", () => {
  assert.equal(getEventDate(2000, "January", "Monday", "third"), 17);
});

//Future event
test("Return the 19th for the Father's Day (third Sunday of June) in 2050", () => {
  assert.equal(getEventDate(2050, "June", "Sunday", "third"), 19);
});
