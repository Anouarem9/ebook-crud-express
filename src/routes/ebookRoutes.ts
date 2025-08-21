import { Router } from 'express';
import * as ebookController from '../controllers/ebookController';
import upload from "../middlewares/fileUploader";
import methodOverride from '../middlewares/methodOverride';

const router = Router();
router.get('/', ebookController.index);
router.get('/create', ebookController.create);
router.get('/edit/:ISBN', ebookController.edit);
router.get('/:ISBN/', ebookController.show);
router.post('/', ebookController.store);
router.put('/:ISBN',  ebookController.update);
router.delete('/:ISBN', ebookController.destroy);

export default router;
