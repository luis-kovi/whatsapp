import { Router } from 'express';
import { getConnections, createConnection, startConnection, stopConnection, getQRCode } from '../controllers/whatsapp.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/connections', getConnections);
router.post('/connections', createConnection);
router.post('/connections/:id/start', startConnection);
router.post('/connections/:id/stop', stopConnection);
router.get('/connections/:id/qrcode', getQRCode);

export default router;
