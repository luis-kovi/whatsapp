import { Router } from 'express';
import { getConnections, createConnection } from '../controllers/whatsapp.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/connections', getConnections);
router.post('/connections', createConnection);

export default router;
