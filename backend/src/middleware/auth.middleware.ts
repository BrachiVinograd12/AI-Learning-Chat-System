import { Request, Response, NextFunction } from 'express';
import { ApiResponse, UserRole } from '@ai-learning/shared';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    const response: ApiResponse<null> = {
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    };
    res.status(401).json(response);
    return;
  }

  const token = authHeader.slice(7);

  try {
    req.user = authService.verifyToken(token);
    next();
  } catch {
    const response: ApiResponse<null> = {
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    };
    res.status(401).json(response);
  }
}

/** Restrict access to users with one of the specified roles. Must run after authenticate. */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      };
      res.status(401).json(response);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      const response: ApiResponse<null> = {
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    try {
      req.user = authService.verifyToken(authHeader.slice(7));
    } catch {
      // Invalid token — continue without user context
    }
  }

  next();
}
