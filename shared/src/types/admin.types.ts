export interface UserMessageCount {
  userId: string;
  userName: string;
  userEmail: string;
  messageCount: number;
}

export interface SubjectUsage {
  subject: string;
  conversationCount: number;
  messageCount: number;
}

export interface UsageStatistics {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  messagesPerUser: UserMessageCount[];
  mostUsedSubjects: SubjectUsage[];
}

export interface AdminConversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}
