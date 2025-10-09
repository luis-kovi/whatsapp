import { Router } from 'express';
import { exportReport } from '../controllers/report.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/export', exportReport);

export default router;
