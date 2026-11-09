import nextEnv from "@next/env";
import { readFile } from "node:fs/promises";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL)
  throw new Error("Configure DATABASE_URL before seeding.");
const catalog = JSON.parse(
  await readFile(new URL("./catalog.json", import.meta.url), "utf8"),
);
const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
try {
  await db.query("BEGIN");
  for (const plan of catalog.plans) {
    await db.query(
      'INSERT INTO "Plan" (key,name,"pageLimit",active) VALUES ($1,$2,$3,true) ON CONFLICT(key) DO UPDATE SET name=EXCLUDED.name,"pageLimit"=EXCLUDED."pageLimit"',
      [plan.key, plan.name, plan.pageLimit],
    );
  }
  for (const template of catalog.templates) {
    // Existing template versions/configuration are never replaced implicitly.
    await db.query(
      'INSERT INTO "Template" (key,name,description,active,version,config,"updatedAt") VALUES ($1,$2,$3,true,$4,$5,NOW()) ON CONFLICT(key) DO NOTHING',
      [
        template.key,
        template.name,
        template.description,
        template.version,
        template.config,
      ],
    );
  }
  for (const block of catalog.blocks) {
    await db.query(
      'INSERT INTO "BlockDefinition" (key,name,description,active,"schemaVersion","updatedAt") VALUES ($1,$2,$3,true,1,NOW()) ON CONFLICT(key) DO NOTHING',
      [block.key, block.name, block.description],
    );
  }
  for (const plan of catalog.plans) {
    // Explicit grants only. No default premium plan/price/limit is invented.
    for (const key of plan.templates)
      await db.query(
        'INSERT INTO "PlanTemplateAccess" ("planKey","templateKey") VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [plan.key, key],
      );
    for (const key of plan.blocks)
      await db.query(
        'INSERT INTO "PlanBlockAccess" ("planKey","blockKey") VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [plan.key, key],
      );
  }
  await db.query("COMMIT");
  console.log(
    "Catalog seeded. Existing configuration and grants preserved; no entitlements assigned.",
  );
} catch (error) {
  await db.query("ROLLBACK");
  throw error;
} finally {
  await db.end();
}
