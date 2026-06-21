import { UserRole } from '@ai-learning/shared';

/** Payload embedded in JWT tokens once authentication is implemented. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/** Extend Express Request after auth middleware validates a token. */
export interface AuthenticatedRequest {
  user?: JwtPayload;
}
