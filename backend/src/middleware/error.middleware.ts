import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@ai-learning/shared';
import { AuthError } from '../services/auth.service';
import { ChatError } from '../services/chat.service';
import { AdminError } from '../services/admin.service';

export function notFoundHandler(_req: Request, res: Response): void {
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
  };
  res.status(404).json(response);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AuthError || err instanceof ChatError || err instanceof AdminError) {
    const response: ApiResponse<null> = {
      success: false,
      error: { code: err.code, message: err.message },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  console.error(err);

  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
    },
  };

  res.status(500).json(response);
}
