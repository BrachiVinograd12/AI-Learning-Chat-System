import { Router } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';
import chatRoutes from './chat.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/chat', chatRoutes);

export default router;
