import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// data 디렉토리 생성
const dataDir = path.join(__dirname, '../data');
try {
  mkdirSync(dataDir, { recursive: true });
} catch (error) {
  // 디렉토리가 이미 존재하는 경우 무시
}

const dbPath = path.join(dataDir, 'y-nutri.db');
const db: DatabaseType = new Database(dbPath);

// 데이터베이스 초기화
export const initDatabase = () => {
  // 사용자 테이블
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      campus TEXT NOT NULL,
      gender TEXT NOT NULL,
      age INTEGER NOT NULL,
      height REAL NOT NULL,
      weight REAL NOT NULL,
      muscleMass REAL,
      bodyFat REAL,
      goal TEXT NOT NULL,
      activityLevel TEXT NOT NULL,
      allergies TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 식단 히스토리 테이블
  db.exec(`
    CREATE TABLE IF NOT EXISTS meal_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      plan_data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    )
  `);

  console.log('Database initialized successfully');
};

export default db;

