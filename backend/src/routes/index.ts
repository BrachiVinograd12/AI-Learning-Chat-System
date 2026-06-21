import { Router } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';
import chatRoutes from './chat.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);

export default router;
