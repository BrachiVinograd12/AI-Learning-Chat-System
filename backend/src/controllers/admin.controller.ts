import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@ai-learning/shared';
import { AdminService } from '../services/admin.service';

const adminService = new AdminService();

export class AdminController {
  getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await adminService.getAllUsers();
      const response: ApiResponse<typeof users> = { success: true, data: users };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.query.userId as string | undefined;
      const conversations = await adminService.getConversations(userId);
      const response: ApiResponse<typeof conversations> = { success: true, data: conversations };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getStatistics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await adminService.getUsageStatistics();
      const response: ApiResponse<typeof stats> = { success: true, data: stats };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
