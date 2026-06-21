import { Schema, model, Document, Types } from 'mongoose';

export interface ICourseDocument extends Document {
  title: string;
  description: string;
  instructorId: Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourseDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export const CourseModel = model<ICourseDocument>('Course', courseSchema);
