import postgres from "postgres";

import fs from "fs";
import path from "path";

import "dotenv/config";

const psql = postgres({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  debug: process.env.NODE_ENV === "dev" ? console.log : undefined,
});

export default psql;

export async function migrate() {
  const migrationsDir = path.resolve("./src/psql_scripts");
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const content = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    console.log(`Running migration: ${file}`);
    await psql.unsafe(content);
  }

  console.log("✅ Migrations complete");
}
