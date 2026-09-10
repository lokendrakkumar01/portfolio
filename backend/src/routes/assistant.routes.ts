import { Router } from 'express';
import { chatWithAssistant } from '../controllers/assistant.controller';

const router = Router();

router.post('/chat', chatWithAssistant);

export default router;
