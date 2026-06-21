export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
}
