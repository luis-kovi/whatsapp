import { Router } from 'express';
import { getContacts } from '../controllers/contact.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
router.get('/', getContacts);

export default router;
