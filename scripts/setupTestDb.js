// scripts/setupTestDb.js

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";

const dbFilePath = path.resolve(
  ".wrangler",
  "state",
  "v3",
  "cache",
  "test-db.sqlite",
);

// データベースの初期化
function initializeDb() {
  // データベースファイルが存在する場合は削除
  if (fs.existsSync(dbFilePath)) {
    fs.unlinkSync(dbFilePath);
  }

  // 新しいデータベースの作成
  const db = new sqlite3.Database(dbFilePath);

  // スキーマとマイグレーションの適用
  const migrationsPath = path.resolve("src", "server", "db", "migrations");
  const files = fs.readdirSync(migrationsPath);
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsPath, file), "utf8");
    db.exec(sql, (err) => {
      if (err) {
        console.error("マイグレーションの適用中にエラーが発生しました:", err);
      }
    });
  }

  db.close();
  console.log("テスト用データベースが初期化されました:", dbFilePath);
}

initializeDb();
export default dbFilePath;
