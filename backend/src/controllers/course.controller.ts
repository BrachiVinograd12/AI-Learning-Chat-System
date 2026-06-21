import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@ai-learning/shared';
import { CourseService } from '../services/course.service';

const courseService = new CourseService();

export class CourseController {
  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courses = await courseService.findAll();
      const response: ApiResponse<typeof courses> = { success: true, data: courses };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course = await courseService.findById(req.params.id);

      if (!course) {
        const response: ApiResponse<null> = {
          success: false,
          error: { code: 'COURSE_NOT_FOUND', message: `Course with id ${req.params.id} not found` },
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof course> = { success: true, data: course };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
