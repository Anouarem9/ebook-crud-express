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
} from "../../models/ebookModel.js";
import { v4 as autoId } from "uuid";
import { EBook } from "../../utils/types.js";
import fs from "fs";
import path from "path";
import { __publicpath } from "../../utils/path.js";
interface Request extends ExpressRequest { 
  body: EBook & {
    categorie?: string;
    titre?: string;
    sort?: string;
    sortBy?: string;
    message?: string;
  };
}
const index = async (req: Request, res: Response) => {
  try {
    const { titre, categorie, sort, sortBy, message } = req.body;
    const ebooks = await getAllEbooks(req.body as EBook);
    const categories = await getCategories();
    return res.status(200).json({ ebooks, categories, titre, categorie, sort, sortBy, message });
  } catch {
    return res.status(500).json({"message": "Database error"});
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const ebook = await getEbookByISBN(req.params.ISBN);

    if (ebook === null) {
      return res.status(404).json({ "message": "Ebook not found"});
    }
    return res.status(200).json({ ebook });
  } catch {
    return res.status(500).json({ "message": "Database error"});
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const { ISBN }= req.body;
    const photo = await getEbookPhoto(ISBN);
    if (photo) {
      const filePath = path.join(__publicpath , photo);
      fs.unlink(filePath, (err) => {
        if(err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ message: "Could not delete file" });
        }
        console.warn("Warn: File deleted successfully");
      });
    }
    const isSuccess = await deleteEbook(ISBN);
    if(isSuccess){
      return res.status(200).json({ "message": "File deleted successfully" });
    } 
    return res.status(404).json({ "message": "Could not delete file" });
  } catch {
    return res.status(500).json({ "message": "Database error"});
  }
};

const store = async (req: Request, res: Response) => {
  try {
    let photo = req.file ? `/images/${req.file.originalname}` : "";
    photo = req.body.photo || photo;
    const ISBN = autoId();
    req.body.photo = photo;
    req.body.ISBN = ISBN;
    if (await recordExists(ISBN)) {
      return res.status(400).json({ "message": "Ebook with this ISBN already exists." });
    }
    await addNewEbook(req.body);
    return res.status(201).json({ "message": "Ebook creation success!" });
  } catch {
    return res.status(500).json({ "message": "Database error"});
  }
};

const update = async (req: Request, res: Response) => { 
  try {
    let photo = req.file ? `/images/${req.file.originalname}` : "";
    photo = req.body.photo || photo;
    const { ISBN } = req.body;
    req.body.photo = photo;
    if (await recordExists(ISBN)) {
      await updateEbook(req.body);
      return res.status(200).json({ message: "Ebook update success!" });
    }
    
    return res.status(404).json({ message: "Ebook doesn't exist." });
  } catch {
    return res.status(500).json({ "message": "Database error"});
  }
};

export { index, show, update, store, destroy };
