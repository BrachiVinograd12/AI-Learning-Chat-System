import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@ai-learning/shared';
// import jwt from 'jsonwebtoken';
// import { jwtConfig } from '../config/jwt.config';
// import { JwtPayload } from '../types/auth.types';

/**
 * Authentication middleware stub.
 *
 * When JWT is implemented:
 * 1. Install: npm install jsonwebtoken @types/jsonwebtoken
 * 2. Read Bearer token from Authorization header
 * 3. Verify with jwt.verify(token, jwtConfig.secret)
 * 4. Attach decoded payload to req.user
 */
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

  // const token = authHeader.slice(7);
  // try {
  //   const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;
  //   req.user = decoded;
  //   next();
  // } catch {
  //   res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } });
  // }

  const response: ApiResponse<null> = {
    success: false,
    error: { code: 'NOT_IMPLEMENTED', message: 'JWT authentication is not yet implemented' },
  };
  res.status(501).json(response);
}

/** Optional auth — attaches user when token is valid, continues otherwise. */
export function optionalAuthenticate(_req: Request, _res: Response, next: NextFunction): void {
  // Implement when JWT is ready
  next();
}
