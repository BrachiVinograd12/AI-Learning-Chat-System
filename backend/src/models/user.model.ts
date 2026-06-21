import { Schema, model, Document } from 'mongoose';
import { UserRole } from '@ai-learning/shared';

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    displayName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Student,
    },
  },
  { timestamps: true },
);

export const UserModel = model<IUserDocument>('User', userSchema);
