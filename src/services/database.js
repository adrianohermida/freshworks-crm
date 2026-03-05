const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const integrations = require('../config/integrations');

const databasePath = process.env.LOCAL_DB_PATH || path.join(process.cwd(), 'data', 'advocacia-dashboard.sqlite');

function runSql(sql) {
  const result = execFileSync('sqlite3', [databasePath, sql], { encoding: 'utf8' });
  return result.trim();
}

function initializeDatabase() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS integrations_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      purpose TEXT NOT NULL,
      status TEXT NOT NULL,
      last_sync TEXT,
      pending_tasks INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  runSql(createTableSql);

  integrations.forEach((integration, index) => {
    const upsertSql = `
      INSERT INTO integrations_status (key, name, purpose, status, last_sync, pending_tasks)
      VALUES (
        '${integration.key}',
        '${integration.name.replace(/'/g, "''")}',
        '${integration.purpose.replace(/'/g, "''")}',
        '${integration.status}',
        datetime('now', '-1 day'),
        ${(index + 1) * 3}
      )
      ON CONFLICT(key) DO UPDATE SET
        name = excluded.name,
        purpose = excluded.purpose;
    `;

    runSql(upsertSql);
  });

  return databasePath;
}

function queryAll(sql) {
  const result = execFileSync('sqlite3', ['-json', databasePath, sql], { encoding: 'utf8' }).trim();
  if (!result) {
    return [];
  }

  try {
    return JSON.parse(result);
  } catch (_error) {
    return [];
  }
}

function ensureDataDirectory() {
  const directory = path.dirname(databasePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

module.exports = {
  databasePath,
  ensureDataDirectory,
  initializeDatabase,
  queryAll
};
