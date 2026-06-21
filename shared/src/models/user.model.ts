export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  Student = 'student',
  Instructor = 'instructor',
  Admin = 'admin',
}
