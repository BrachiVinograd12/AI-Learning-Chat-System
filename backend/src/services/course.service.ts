import { Course } from '@ai-learning/shared';
import { CourseModel, ICourseDocument } from '../models/course.model';

function toCourseDto(doc: ICourseDocument): Course {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    instructorId: doc.instructorId.toString(),
    tags: doc.tags,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export class CourseService {
  async findAll(): Promise<Course[]> {
    const courses = await CourseModel.find().sort({ createdAt: -1 }).exec();
    return courses.map(toCourseDto);
  }

  async findById(id: string): Promise<Course | null> {
    const course = await CourseModel.findById(id).exec();
    return course ? toCourseDto(course) : null;
  }
}
