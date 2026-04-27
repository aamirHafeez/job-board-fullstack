import mysql from 'mysql2/promise';

function getSslConfig() {
  if (process.env.DB_SSL !== 'true') return undefined;

  return {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n') } : {})
  };
}

async function exists(connection, sql) {
  const [rows] = await connection.query(sql);
  return rows.length > 0;
}

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: getSslConfig()
});

try {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS auth_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token_hash CHAR(64) NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_auth_tokens_user_id (user_id),
      INDEX idx_auth_tokens_expires_at (expires_at),
      CONSTRAINT fk_auth_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);

  const hasUserIdColumn = await exists(
    connection,
    "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'jobs' AND COLUMN_NAME = 'user_id'"
  );

  if (!hasUserIdColumn) {
    await connection.query('ALTER TABLE jobs ADD COLUMN user_id INT NULL AFTER id');
  }

  const hasUserIndex = await exists(
    connection,
    "SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'jobs' AND INDEX_NAME = 'idx_jobs_user_id'"
  );

  if (!hasUserIndex) {
    await connection.query('CREATE INDEX idx_jobs_user_id ON jobs (user_id)');
  }

  const hasJobConstraint = await exists(
    connection,
    "SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'jobs' AND CONSTRAINT_NAME = 'fk_jobs_user'"
  );

  if (!hasJobConstraint) {
    await connection.query(`
      ALTER TABLE jobs
        ADD CONSTRAINT fk_jobs_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
    `);
  }

  const [jobRows] = await connection.query('SELECT COUNT(*) AS count FROM jobs');
  console.log(`Auth migration complete. Existing jobs: ${jobRows[0].count}.`);
} finally {
  await connection.end();
}
