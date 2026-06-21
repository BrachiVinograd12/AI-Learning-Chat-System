import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
} from '@ai-learning/shared';
import { jwtConfig } from '../config/jwt.config';
import { IUserDocument, UserModel } from '../models/user.model';
import { JwtPayload } from '../types/auth.types';

const SALT_ROUNDS = 12;

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

function toUserDto(doc: IUserDocument): User {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export class AuthService {
  async register(input: RegisterRequest): Promise<AuthResponse> {
    this.validateRegisterInput(input);

    const existing = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      throw new AuthError('Email is already registered', 'EMAIL_EXISTS', 409);
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await UserModel.create({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      passwordHash,
      role: UserRole.Student,
    });

    const token = this.generateToken(user);
    return { user: toUserDto(user), token };
  }

  async login(input: LoginRequest): Promise<AuthResponse> {
    this.validateLoginInput(input);

    const user = await UserModel.findOne({ email: input.email.toLowerCase() }).select(
      '+passwordHash',
    );

    if (!user) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatch) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    const token = this.generateToken(user);
    return { user: toUserDto(user), token };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AuthError('User not found', 'USER_NOT_FOUND', 404);
    }
    return toUserDto(user);
  }

  generateToken(user: IUserDocument): string {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const options: SignOptions = {
      expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    };

    return jwt.sign(payload, jwtConfig.secret, options);
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }) as JwtPayload;
  }

  private validateRegisterInput(input: RegisterRequest): void {
    if (!input.name?.trim()) {
      throw new AuthError('Name is required', 'VALIDATION_ERROR', 400);
    }
    if (!input.email?.trim()) {
      throw new AuthError('Email is required', 'VALIDATION_ERROR', 400);
    }
    if (!this.isValidEmail(input.email)) {
      throw new AuthError('Invalid email format', 'VALIDATION_ERROR', 400);
    }
    if (!input.password || input.password.length < 8) {
      throw new AuthError('Password must be at least 8 characters', 'VALIDATION_ERROR', 400);
    }
  }

  private validateLoginInput(input: LoginRequest): void {
    if (!input.email?.trim() || !input.password) {
      throw new AuthError('Email and password are required', 'VALIDATION_ERROR', 400);
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
