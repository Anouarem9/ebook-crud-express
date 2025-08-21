import { Router } from 'express';
// import * as ebookApiController from '../controllers/ebookApiController';
import upload from "../middlewares/fileUploader";

const router = Router();
// router.get('/', ebookApiController.index); 
// router.get('/:ISBN', ebookApiController.show);
// router.post('/', upload.single('photo'), ebookApiController.store); 
// // router.put('/:ISBN', ebookApiController.update);
// router.delete('/:ISBN', ebookApiController.destroy);

export default router;
