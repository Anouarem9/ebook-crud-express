import "./utils/envconfig";

const HOST = process.env.HOST || "http://localhost";
const PORT = process.env.PORT || 9999;

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import ebookRoutes from "./routes/ebookRoutes";
import ebookApiRoutes from "./apis/routes/ebookApiRoutes";
import { initializeDatabase } from "./config/initDb";
import path from "path";
import { __viewspath } from "./utils/path";
import methodOverride from "./middlewares/methodOverride";
import upload from "./middlewares/fileUploader";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(express.static("public"));
app.use(methodOverride);


app.set("view engine", "ejs");
app.set("views", __viewspath); 

app.use("/ebooks", upload.single('photo'), methodOverride, ebookRoutes);
app.use("/api/v1/ebooks", upload.single('photo'), methodOverride, ebookApiRoutes);

app.use("*", (req: Request, res: Response)=>res.status(404).send("404 page not found!"));
 
app.listen(PORT, async() => {
  await initializeDatabase();
  console.log(`Server running on ${HOST}:${PORT}`);
});
