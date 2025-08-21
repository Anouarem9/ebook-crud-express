import mysql, { type Pool } from "mysql2/promise";

const pool: Pool = mysql.createPool({
  database: "gestion_ebook",
  host: "localhost",
  user: "root",
  password: "root",
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export { pool };
