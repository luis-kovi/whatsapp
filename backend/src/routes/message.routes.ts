import { Router } from 'express';
import { sendMessage } from '../controllers/message.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/', sendMessage);

export default router;
