export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export enum ChatRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export interface ChatSession {
  id: string;
  userId: string;
  courseId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
