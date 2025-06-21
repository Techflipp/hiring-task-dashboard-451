import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { exit } from "node:process";
import openapiTS, { astToString } from "openapi-typescript";


dotenv.config();

const outputFolder = path.resolve(__dirname, "../src/services/api");

async function generate() {
  const schemaUrl = process.env.OPENAPI_URL;

  if (!schemaUrl) {
    console.error("OPENAPI_URL environment variable is required");
    exit(1);
  }

  const res = await fetch(schemaUrl);
  if (!res.ok) {
    console.error(`Failed to fetch OpenAPI schema: ${res.statusText}`);
    exit(1);
  }

  const openapiSchema = await res.json();
  const openapiStr = JSON.stringify(openapiSchema, null, 2);
  fs.writeFileSync(path.resolve(outputFolder, "openapi.json"), openapiStr);

  const ast = await openapiTS(openapiSchema, {
    enum: true,
  });

  const types = astToString(ast);
  fs.writeFileSync(path.resolve(outputFolder, "types.ts"), types);
  console.log("✅ OpenAPI types generated successfully");
  exit(0);
}

generate();
