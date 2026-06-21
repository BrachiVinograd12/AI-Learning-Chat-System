import {
  AdminConversation,
  UsageStatistics,
  User,
  UserMessageCount,
  SubjectUsage,
} from '@ai-learning/shared';
import { Types } from 'mongoose';
import { ConversationModel } from '../models/conversation.model';
import { IUserDocument, UserModel } from '../models/user.model';

export class AdminError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'AdminError';
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

interface ConversationAggregateDoc {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  subject: string;
  messages: unknown[];
  createdAt: Date;
  updatedAt: Date;
  user: { name: string; email: string };
}

interface MessageCountAggregate {
  _id: Types.ObjectId;
  messageCount: number;
  user: { name: string; email: string };
}

interface SubjectAggregate {
  _id: string;
  conversationCount: number;
  messageCount: number;
}

export class AdminService {
  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find().sort({ createdAt: -1 }).exec();
    return users.map(toUserDto);
  }

  async getConversations(userId?: string): Promise<AdminConversation[]> {
    const filter: Record<string, Types.ObjectId> = {};

    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        throw new AdminError('Invalid user id', 'VALIDATION_ERROR', 400);
      }
      filter.userId = new Types.ObjectId(userId);
    }

    const conversations = await ConversationModel.aggregate<ConversationAggregateDoc>([
      ...(Object.keys(filter).length ? [{ $match: filter }] : []),
      { $sort: { createdAt: -1 as const } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: 1,
          subject: 1,
          messages: 1,
          createdAt: 1,
          updatedAt: 1,
          user: { name: '$user.name', email: '$user.email' },
        },
      },
    ]);

    return conversations.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      userName: doc.user.name,
      userEmail: doc.user.email,
      subject: doc.subject,
      messageCount: doc.messages.length,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));
  }

  async getUsageStatistics(): Promise<UsageStatistics> {
    const [totalUsers, totalConversations, messagesPerUser, mostUsedSubjects, totalMessagesResult] =
      await Promise.all([
        UserModel.countDocuments(),
        ConversationModel.countDocuments(),
        this.getMessagesPerUser(),
        this.getMostUsedSubjects(),
        ConversationModel.aggregate<{ total: number }>([
          { $project: { messageCount: { $size: '$messages' } } },
          { $group: { _id: null, total: { $sum: '$messageCount' } } },
        ]),
      ]);

    return {
      totalUsers,
      totalConversations,
      totalMessages: totalMessagesResult[0]?.total ?? 0,
      messagesPerUser,
      mostUsedSubjects,
    };
  }

  private async getMessagesPerUser(): Promise<UserMessageCount[]> {
    const results = await ConversationModel.aggregate<MessageCountAggregate>([
      { $unwind: '$messages' },
      { $group: { _id: '$userId', messageCount: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $sort: { messageCount: -1 } },
      {
        $project: {
          messageCount: 1,
          user: { name: '$user.name', email: '$user.email' },
        },
      },
    ]);

    return results.map((row) => ({
      userId: row._id.toString(),
      userName: row.user.name,
      userEmail: row.user.email,
      messageCount: row.messageCount,
    }));
  }

  private async getMostUsedSubjects(): Promise<SubjectUsage[]> {
    const results = await ConversationModel.aggregate<SubjectAggregate>([
      {
        $group: {
          _id: '$subject',
          conversationCount: { $sum: 1 },
          messageCount: { $sum: { $size: '$messages' } },
        },
      },
      { $sort: { messageCount: -1 } },
      { $limit: 10 },
    ]);

    return results.map((row) => ({
      subject: row._id,
      conversationCount: row.conversationCount,
      messageCount: row.messageCount,
    }));
  }
}
