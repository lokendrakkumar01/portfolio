import { Router } from 'express';
import { getMessages, getMessage, updateMessageStatus, deleteMessage } from '../controllers/message.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.use(protect, adminOnly);

router.get('/', getMessages);
router.get('/:id', getMessage);
router.put('/:id/status', updateMessageStatus);
router.delete('/:id', deleteMessage);

export default router;
