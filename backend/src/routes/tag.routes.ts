import { Router } from 'express';
import { getTags, createTag } from '../controllers/tag.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/', getTags);
router.post('/', createTag);

export default router;
