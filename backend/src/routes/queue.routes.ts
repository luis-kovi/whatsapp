import { Router } from 'express';
import { getQueues, createQueue, updateQueue, deleteQueue } from '../controllers/queue.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.get('/', getQueues);
router.post('/', authorize('ADMIN'), createQueue);
router.put('/:id', authorize('ADMIN'), updateQueue);
router.delete('/:id', authorize('ADMIN'), deleteQueue);

export default router;
