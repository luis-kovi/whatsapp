import { Router } from 'express';
import { getTickets, getTicket, acceptTicket, closeTicket, transferTicket } from '../controllers/ticket.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getTickets);
router.get('/:id', getTicket);
router.put('/:id/accept', acceptTicket);
router.put('/:id/close', closeTicket);
router.put('/:id/transfer', transferTicket);

export default router;
