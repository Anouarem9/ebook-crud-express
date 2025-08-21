import { type Request as ExpressRequest, type Response } from "express";
import {
  addNewEbook,
  deleteEbook,
  getAllEbooks,
  getCategories,
  getEbookByISBN,
  getEbookPhoto,
  recordExists,
  updateEbook,
} from "../models/ebookModel.js";
import { v4 as autoId } from "uuid";
import { EBook } from "../utils/types.js";
import fs from "fs";
import path from "path";
import { __publicpath } from "../utils/path.js";
interface Request extends ExpressRequest {
  query: {
    categorie?: string;
    titre?: string;
    sort?: string;
    sortBy?: string;
    message?: string;
  };
  body: EBook;
  params: {
    ISBN?: string;
  }
}
const index = async (req: Request, res: Response) => {
  try {
    const { titre, categorie, sort, sortBy, message } = req.query;
    const ebooks = await getAllEbooks(req.query);
    const categories = await getCategories();
    return res.render("index", { ebooks, categories, titre, categorie, sort, sortBy, message });
  } catch (err) {
    return res.status(500).send("Database error" + err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    if(req.params.ISBN === undefined) { 
    return res.redirect("/ebooks?message=" + encodeURIComponent("No ISBN in params"));
    }
    const ebook = await getEbookByISBN(req.params.ISBN);

    if (ebook === null) {
      return res.status(404).send("Ebook not found");
    }
    return res.render("details", { ebook });
  } catch (err) {
    return res.status(500).send("Database error");
  }
};

const create = async (req: Request, res: Response) => {
  return res.render("add");
};

const edit = async (req: Request, res: Response) => {
  try {
    if(req.params.ISBN === undefined) { 
    return res.redirect("/ebooks?message=" + encodeURIComponent("No ISBN in params"));
    }
    const ebook = await getEbookByISBN(req.params.ISBN);

    if (ebook === null) {
      return res.status(404).send("Ebook not found");
    }
    return res.render("edit", { ebook });
  } catch (err) {
    return res.status(500).send("Database error");
  } 
};

const destroy = async (req: Request, res: Response) => {
  try {
    if(req.params.ISBN === undefined) { 
    return res.redirect("/ebooks?message=" + encodeURIComponent("No ISBN in params"));
    }
    const { ISBN }= req.params;
    const photo = await getEbookPhoto(ISBN);
    if (photo) {
      const filePath = path.join(__publicpath , photo);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ error: "Could not delete file" });
        }
        console.warn("Warn: File deleted successfully");
      });
    }
    const isSuccess = await deleteEbook(ISBN);
    const message = isSuccess ? "File deleted successfully" : "Could not delete file";
    return res.redirect("/ebooks?message=" + encodeURIComponent(message));
  } catch (err) {
    return res.status(500).send("Database error");
  }
};

const store = async (req: Request, res: Response) => {
  try {
    const photo = req.file ? `/images/${req.file.originalname}` : "";
    const ISBN = autoId();
    req.body.photo = photo;
    req.body.ISBN = ISBN;
    if (await recordExists(ISBN)) {
      return res.status(400).send("Ebook with this ISBN already exists.");
    }
    await addNewEbook(req.body);
    return res.redirect("/ebooks");
  } catch (err) {
    return res.status(500).send("Database error");
  }
};

const update = async (req: Request, res: Response) => {
  try {
    if(req.params.ISBN === undefined) { 
      return res.redirect("/ebooks?message=" + encodeURIComponent("No ISBN in params"));
    }
    const photo = req.file ? `/images/${req.file.originalname}` : "";
    const { ISBN } = req.params;
    const { titre, description, date_edition, prix, categorie } = req.body;
    req.body.photo = photo;
    req.body.ISBN = ISBN;
    if (await recordExists(ISBN)) {
      await updateEbook(req.body);
      return res.redirect("/ebooks");
    }

    return res.status(400).send("Ebook doesn't exist.");
  } catch (err) {
    return res.status(500).send("Database error");
  }
};

export { index, show, create , edit, update, store, destroy };
