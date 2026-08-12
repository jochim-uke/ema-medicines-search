import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const EMA_SOURCE_URL =
  "https://www.ema.europa.eu/en/documents/report/medicines-output-medicines_json-report_en.json";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function normalize(value) {
  return String(value ?? "").trim().toLocaleLowerCase("en");
}

export function isIncludedMedicine(record) {
  return normalize(record?.category) === "human" &&
    normalize(record?.medicine_status) === "authorised";
}

export function splitList(value) {
  return String(value ?? "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function transformRecord(record) {
  return {
    name: String(record.name_of_medicine ?? "").trim(),
    inn: String(
      record.international_non_proprietary_name_common_name ?? "",
    ).trim(),
    groups: splitList(record.pharmacotherapeutic_group_human),
    areas: splitList(record.therapeutic_area_mesh),
    indication: String(record.therapeutic_indication ?? "").trim(),
    holder: String(
      record.marketing_authorisation_developer_applicant_holder ?? "",
    ).trim(),
    authorisationDate: String(record.marketing_authorisation_date ?? "").trim(),
    url: String(record.medicine_url ?? "").trim(),
  };
}

export function transformPayload(payload) {
  if (!payload || !Array.isArray(payload.data)) {
    throw new Error("EMA response does not contain a data array.");
  }

  const medicines = payload.data
    .filter(isIncludedMedicine)
    .map(transformRecord)
    .filter((record) => record.name && record.url)
    .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

  if (medicines.length < 1000) {
    throw new Error(`Safety check failed: only ${medicines.length} records remain.`);
  }

  return {
    meta: {
      source: EMA_SOURCE_URL,
      sourceTimestamp: payload.meta?.timestamp ?? null,
      generatedAt: new Date().toISOString(),
      count: medicines.length,
      filters: { category: "Human", medicineStatus: "Authorised" },
    },
    medicines,
  };
}

async function loadSource(source) {
  if (/^https?:\/\//i.test(source)) {
    const response = await fetch(source, {
      headers: { "User-Agent": "ema-medicines-search/1.0" },
    });
    if (!response.ok) {
      throw new Error(`EMA download failed with HTTP ${response.status}.`);
    }
    return response.json();
  }

  return JSON.parse(await readFile(resolve(source), "utf8"));
}

async function main() {
  const source = process.argv[2] || EMA_SOURCE_URL;
  const destination = resolve(process.argv[3] || `${projectRoot}/data/medicines.json`);
  const payload = await loadSource(source);
  const result = transformPayload(payload);

  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(result)}\n`, "utf8");
  console.log(`Wrote ${result.medicines.length} medicines to ${destination}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
