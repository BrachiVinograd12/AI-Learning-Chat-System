import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
// import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const courseController = new CourseController();

// router.use(authenticate); // Enable when JWT auth is implemented

router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);

export default router;
