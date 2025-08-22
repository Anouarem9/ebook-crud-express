import { Router } from 'express';
import * as ebookApiController from '../controllers/ebookApiController';
import upload from "../../middlewares/fileUploader";

const router = Router();
router.get('/', ebookApiController.index); 
router.get('/:ISBN', ebookApiController.show);
router.put('/', ebookApiController.update);
router.post('/',ebookApiController.store); 
router.delete('/', ebookApiController.destroy);

export default router;
