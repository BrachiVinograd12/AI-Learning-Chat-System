import { Request, Response, NextFunction } from 'express';
import { ApiResponse, LoginRequest, RegisterRequest } from '@ai-learning/shared';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: RegisterRequest = req.body;
      const result = await authService.register(input);
      const response: ApiResponse<typeof result> = { success: true, data: result };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: LoginRequest = req.body;
      const result = await authService.login(input);
      const response: ApiResponse<typeof result> = { success: true, data: result };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
        return;
      }

      const user = await authService.getProfile(req.user.sub);
      const response: ApiResponse<typeof user> = { success: true, data: user };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
