import {
  Conversation,
  CreateConversationRequest,
  LearningMode,
  Message,
  MessageRole,
  SendMessageRequest,
} from '@ai-learning/shared';
import { Types } from 'mongoose';
import {
  ConversationModel,
  IConversationDocument,
  IMessageDocument,
} from '../models/conversation.model';
import { AiService } from './ai.service';

export class ChatError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

function toMessageDto(msg: IMessageDocument): Message {
  return {
    id: msg._id.toString(),
    role: msg.role,
    content: msg.content,
    mode: msg.mode,
    timestamp: msg.timestamp.toISOString(),
  };
}

function toConversationDto(doc: IConversationDocument): Conversation {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    subject: doc.subject,
    messages: doc.messages.map(toMessageDto),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function validateMode(mode: string | undefined): LearningMode {
  if (!mode) {
    throw new ChatError(
      'Mode is required. Use: explanation, practice, exam, or hint',
      'VALIDATION_ERROR',
      400,
    );
  }

  if (!Object.values(LearningMode).includes(mode as LearningMode)) {
    throw new ChatError(
      `Invalid mode "${mode}". Must be one of: ${Object.values(LearningMode).join(', ')}`,
      'VALIDATION_ERROR',
      400,
    );
  }

  return mode as LearningMode;
}

export class ChatService {
  constructor(private readonly aiService = new AiService()) {}

  async createConversation(userId: string, input: CreateConversationRequest): Promise<Conversation> {
    if (!input.subject?.trim()) {
      throw new ChatError('Subject is required', 'VALIDATION_ERROR', 400);
    }

    const conversation = await ConversationModel.create({
      userId: new Types.ObjectId(userId),
      subject: input.subject.trim(),
      messages: [],
    });

    return toConversationDto(conversation);
  }

  async getConversation(conversationId: string, userId: string): Promise<Conversation> {
    const conversation = await this.findOwnedConversation(conversationId, userId);
    return toConversationDto(conversation);
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    input: SendMessageRequest,
  ): Promise<Conversation> {
    if (!input.content?.trim()) {
      throw new ChatError('Message content is required', 'VALIDATION_ERROR', 400);
    }

    const mode = validateMode(input.mode);
    const conversation = await this.findOwnedConversation(conversationId, userId);

    conversation.messages.push({
      _id: new Types.ObjectId(),
      role: MessageRole.User,
      content: input.content.trim(),
      mode,
      timestamp: new Date(),
    });

    const history = conversation.messages.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const assistantContent = await this.aiService.generateReply(
      conversation.subject,
      mode,
      history,
    );

    conversation.messages.push({
      _id: new Types.ObjectId(),
      role: MessageRole.Assistant,
      content: assistantContent,
      mode,
      timestamp: new Date(),
    });

    await conversation.save();
    return toConversationDto(conversation);
  }

  private async findOwnedConversation(
    conversationId: string,
    userId: string,
  ): Promise<IConversationDocument> {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new ChatError('Invalid conversation id', 'VALIDATION_ERROR', 400);
    }

    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation) {
      throw new ChatError('Conversation not found', 'CONVERSATION_NOT_FOUND', 404);
    }

    if (conversation.userId.toString() !== userId) {
      throw new ChatError('Access denied', 'FORBIDDEN', 403);
    }

    return conversation;
  }
}
