import { Router } from 'express';
import { getSettings } from '../controllers/setting.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/', getSettings);

export default router;
