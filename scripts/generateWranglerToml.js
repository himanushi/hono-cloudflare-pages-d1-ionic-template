const fs = require("node:fs");
const dotenv = require("dotenv");

dotenv.config();

const devTomlPath = "wrangler.dev.toml";
let tomlContent = fs.readFileSync(devTomlPath, "utf8");

for (const [key, value] of Object.entries(process.env)) {
  const placeholder = new RegExp(`\\$\\{${key}\\}`, "g");
  tomlContent = tomlContent.replace(placeholder, value || "");
}

fs.writeFileSync("wrangler.toml", tomlContent, "utf8");
console.log("wrangler.toml has been generated successfully.");
