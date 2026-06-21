import { Router } from 'express';
import { UserRole } from '@ai-learning/shared';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.use(authenticate, authorize(UserRole.Admin));

router.get('/users', adminController.getUsers);
router.get('/conversations', adminController.getConversations);
router.get('/stats', adminController.getStatistics);

export default router;
