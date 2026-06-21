import { UserRole } from '@ai-learning/shared';

export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
