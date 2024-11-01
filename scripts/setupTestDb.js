import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dbFilePath = path.resolve(
  ".wrangler",
  "state",
  "v3",
  "cache",
  "test-db.sqlite",
);

// テスト用データベースの初期化
function initializeDb() {
  // 既存のテスト用データベースファイルがあれば削除
  if (fs.existsSync(dbFilePath)) {
    fs.unlinkSync(dbFilePath);
  }

  // 新しいデータベースの作成
  const db = new Database(dbFilePath);

  // マイグレーションの適用
  const migrationsPath = path.resolve("src", "server", "db", "migrations");
  fs.readdirSync(migrationsPath).forEach((file) => {
    const filePath = path.join(migrationsPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const sql = fs.readFileSync(filePath, "utf8");
      db.exec(sql);
    }
  });

  db.close();
  console.log("テスト用データベースが初期化されました:", dbFilePath);
}

// データベースの初期化を実行
initializeDb();
export default dbFilePath;
