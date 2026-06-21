export enum MessageRole {
  User = 'user',
  Assistant = 'assistant',
}

export enum LearningMode {
  Explanation = 'explanation',
  Practice = 'practice',
  Exam = 'exam',
  Hint = 'hint',
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  mode: LearningMode;
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  subject: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationRequest {
  subject: string;
}

export interface SendMessageRequest {
  content: string;
  mode: LearningMode;
}

/** @deprecated Use Conversation instead */
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

/** @deprecated Use MessageRole instead */
export enum ChatRole {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

/** @deprecated Use Conversation instead */
export interface ChatSession {
  id: string;
  userId: string;
  courseId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
