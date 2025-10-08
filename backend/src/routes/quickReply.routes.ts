import { Router } from 'express';
import { getQuickReplies, createQuickReply } from '../controllers/quickReply.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/', getQuickReplies);
router.post('/', createQuickReply);

export default router;
