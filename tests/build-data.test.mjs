import test from "node:test";
import assert from "node:assert/strict";
import { isIncludedMedicine, normalize } from "../scripts/build-data.mjs";

test("normalizes spacing and case", () => {
  assert.equal(normalize("  HuMaN "), "human");
});

test("includes human authorised medicines with spelling case variations", () => {
  assert.equal(
    isIncludedMedicine({ category: " human ", medicine_status: "AUTHORISED" }),
    true,
  );
});

test("excludes veterinary and non-authorised medicines", () => {
  assert.equal(
    isIncludedMedicine({ category: "Veterinary", medicine_status: "Authorised" }),
    false,
  );
  assert.equal(
    isIncludedMedicine({ category: "Human", medicine_status: "Withdrawn" }),
    false,
  );
});
