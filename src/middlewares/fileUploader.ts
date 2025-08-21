import multer from "multer";
import { __imagespath } from "../utils/path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __imagespath); // Store files in the 'public/images' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Unique filename
  },
});
// Initialize multer upload
const upload = multer({ storage: storage });
export default upload;
