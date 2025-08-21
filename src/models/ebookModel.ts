import { ResultSetHeader } from "mysql2";
import { pool } from "../config/db.js";
import { type EBook } from "../utils/types.js";

async function getAllEbooks({
  categorie = "",
  titre = "",
  sort = "ASC",
  sortBy = "date_edition",
}): Promise<EBook[]> {
  let query = "SELECT * FROM ebooks WHERE 1=1";
  let params = [];
  if (categorie !== "") {
    query += " AND categorie LIKE ?";
    params.push(`%${categorie}%`);
  }
  if (titre !== "") {
    query += " AND titre LIKE ?";
    params.push(`%${titre}%`);
  }

  const order = sort === "ASC" ? "ASC" : "DESC";
  query += ` ORDER BY ${sortBy} ${order}`;
  const [eBooks] = await pool.query<EBook[]>(query, params);
  return eBooks;
}

async function getCategories() {
  const [results] = await pool.query<EBook[]>(
    "SELECT DISTINCT categorie FROM ebooks"
  );
  return results.map((eBook) => eBook.categorie);
}

async function getEbookByISBN(ISBN: string): Promise<EBook | null> {
  const [eBook] = await pool.query<EBook[]>(
    "SELECT * FROM ebooks WHERE ISBN = ?",
    [ISBN]
  );
  return eBook.length > 0 ? eBook[0] : null;
}

async function addNewEbook(ebook: EBook) {
  const query =
    "INSERT INTO ebooks (ISBN, titre, description, date_edition, photo, prix, categorie) VALUES (?, ?, ?, ?, ?, ?, ?)";
  pool.query(query, [
    ebook.ISBN,
    ebook.titre,
    ebook.description,
    ebook.date_edition,
    ebook.photo,
    ebook.prix,
    ebook.categorie,
  ]);
}

async function updateEbook(ebook: EBook) {
  const query =`
    UPDATE ebooks
    SET 
      ISBN = ?, 
      titre = ?, 
      description = ?, 
      date_edition = ?, 
      photo = ?, 
      prix = ?, 
      categorie = ?
    WHERE ISBN = ?; 
  `;
  pool.query(query, [
    ebook.ISBN,
    ebook.titre,
    ebook.description,
    ebook.date_edition,
    ebook.photo,
    ebook.prix,
    ebook.categorie,
    ebook.ISBN,
  ]);
}

async function getEbookPhoto(ISBN: string): Promise<string|null> {
  const eBook = await getEbookByISBN(ISBN);
  if (eBook === null) {return null}
  return eBook.photo;
}

async function deleteEbook(ISBN: string): Promise<boolean> {
  const query = "DELETE FROM ebooks WHERE ISBN=?";
  const [result] = await pool.query<ResultSetHeader>(query, [ISBN]);
  if (result.affectedRows > 0) {
    return true; // successfully deleted
  }
  
  return false; // nothing deleted
}

async function recordExists(ISBN: string): Promise<boolean> {
  return (await getEbookByISBN(ISBN)) !== null;
}

export {
  getAllEbooks,
  getCategories,
  getEbookByISBN,
  addNewEbook,
  deleteEbook,
  getEbookPhoto,
  recordExists,
  updateEbook,
};
