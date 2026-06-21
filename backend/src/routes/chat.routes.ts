import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const chatController = new ChatController();

router.use(authenticate);

router.post('/conversations', chatController.createConversation);
router.get('/conversations/:id', chatController.getConversation);
router.post('/conversations/:id/messages', chatController.sendMessage);

export default router;
