import fs from "node:fs";
import path from "node:path";

function findSqliteFile(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const result = findSqliteFile(fullPath);
      if (result) return result;
    } else if (file.endsWith(".sqlite")) {
      return fullPath;
    }
  }
  return null;
}

const dbPath = findSqliteFile(".wrangler/state");
if (dbPath) {
  console.log(dbPath);
} else {
  console.error("SQLite database not found.");
  process.exit(1);
}
