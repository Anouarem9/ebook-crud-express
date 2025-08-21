import mysql, { type Connection } from "mysql2/promise";
import { v4 as autoId } from "uuid";
import { EBook } from "../utils/types";
import { promises as fs } from "fs";
import * as path from "path";
import { __imagesbackuppath, __imagespath } from "../utils/path";
let db: Connection | null = null;
export async function initializeDatabase() {
  try {
    await createConnection();
    await connect();
    await createDB();
    await useDB();
    await createTable();
    const seed = await seedTable();
    db?.destroy();
    db = null;

    if (seed !== false) {
      try {
        await fs.cp(__imagesbackuppath, __imagespath, { recursive: true });
        console.log(
          `Directory copied from ${__imagesbackuppath} to ${__imagespath}`
        );
      } catch (err) {
        console.error("Error copying directory:", err);
      }
    }
  } catch (err) {
    throw new Error("Error: Connection to DB Failed!");
  }
}

async function createConnection() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      multipleStatements: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  } catch (err) {
    throw new Error("Error: DB Connection Instantiation Failed!");
  }
}
async function connect() {
  try {
    if (db === null) {
      console.error("Error: DB Connection Instantiation Failed!");
      throw new Error("Error: DB Connection Instantiation Failed!");
    }
    await db.connect();
    console.log("Info: Connection to DB Success!");
  } catch {
    throw new Error("Error: Connection to DB Failed!");
  }
}
async function createDB() {
  try {
    await db?.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  } catch {
    throw new Error("Error: DB Creation Failed!");
  }
}
async function useDB() {
  try {
    await db?.changeUser({ database: "gestion_ebook" });
  } catch {
    throw new Error("Error: Switching to DB Failed!");
  }
}
async function createTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS ebooks (
        ISBN VARCHAR(255) PRIMARY KEY,
        titre VARCHAR(50) NOT NULL,
        description VARCHAR(255) NOT NULL,
        date_edition DATE NOT NULL,
        photo VARCHAR(255) NOT NULL,
        prix FLOAT NOT NULL,
        categorie VARCHAR(25) NOT NULL
      )
    `;
    await db?.query(query);
    console.log("Info: DB Table is Created Success!");
  } catch {
    throw new Error("Error: Creating table Fail!");
  }
}
async function seedTable(): Promise<void | false> {
  try {
    if (db === null) {
      console.error("Error: DB Connection Instantiation Failed!");
      throw new Error("Error: DB Connection Instantiation Failed!");
    }
    const [result] = await db.query<EBook[]>("SELECT * FROM ebooks");
    if (result.length === 0) {
      console.log("Info: Seeding Table... Start!");
      const insertQuery = `
        INSERT INTO ebooks (ISBN, titre, description, date_edition, photo, prix, categorie) 
        VALUES
            ('${autoId()}', "The Great Gatsby", "A novel set in the 1920s.", "1925-04-10", "/images/gatsby.jpg", 12.99, "Fiction"),
            ('${autoId()}', "To Kill a Mockingbird", "Classic novel about racial injustice.", "1960-07-11", "/images/mockingbird.jpg", 14.50, "Fiction"),
            ('${autoId()}', "1984", "Dystopian novel by George Orwell.", "1949-06-08", "/images/1984.jpg", 10.99, "Sci-Fi"),
            ('${autoId()}', "Moby-Dick", "A sea adventure novel.", "1851-10-18", "/images/mobydick.jpg", 9.99, "Adventure"),
            ('${autoId()}', "Pride and Prejudice", "A classic romance novel.", "1813-01-28", "/images/pride.jpg", 8.99, "Romance")
      `;
      try {
        await db.query(insertQuery);
        console.log("Info: Data insertion Success!");
      } catch {
        throw new Error("Error: Connection to DB Failed!");
      }
    } else {
      console.log("Info: Seeding Table... Abort");
      return false;
    }
  } catch {
    throw new Error("Error: seeding table!");
  }
}
