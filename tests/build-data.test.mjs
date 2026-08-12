import test from "node:test";
import assert from "node:assert/strict";
import {
  isIncludedMedicine,
  normalize,
  splitList,
  transformRecord,
} from "../scripts/build-data.mjs";

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

test("splits semicolon-separated EMA values and removes empty items", () => {
  assert.deepEqual(splitList("Antineoplastic agents; Immunosuppressants; "), [
    "Antineoplastic agents",
    "Immunosuppressants",
  ]);
});

test("maps pharmacotherapeutic and marketing authorisation metadata", () => {
  const medicine = transformRecord({
    name_of_medicine: "Example",
    international_non_proprietary_name_common_name: "example substance",
    pharmacotherapeutic_group_human: "Group A;Group B",
    therapeutic_area_mesh: "Area A;Area B",
    therapeutic_indication: "Example indication.",
    marketing_authorisation_developer_applicant_holder: "Example Pharma",
    marketing_authorisation_date: "01/02/2024",
    medicine_url: "https://example.test/medicine",
  });

  assert.deepEqual(medicine.groups, ["Group A", "Group B"]);
  assert.deepEqual(medicine.areas, ["Area A", "Area B"]);
  assert.equal(medicine.holder, "Example Pharma");
  assert.equal(medicine.authorisationDate, "01/02/2024");
});
