import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@ai-learning/shared';

const router = Router();
const courseController = new CourseController();

router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);

// Example: admin-only route placeholder for future course management
router.post(
  '/',
  authenticate,
  authorize(UserRole.Admin),
  (_req, res) => {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Create course not yet implemented' },
    });
  },
);

export default router;
