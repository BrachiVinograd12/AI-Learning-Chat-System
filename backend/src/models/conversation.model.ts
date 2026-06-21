import { Schema, model, Document, Types } from 'mongoose';
import { LearningMode, MessageRole } from '@ai-learning/shared';

export interface IMessageDocument {
  _id: Types.ObjectId;
  role: MessageRole;
  content: string;
  mode: LearningMode;
  timestamp: Date;
}

export interface IConversationDocument extends Document {
  userId: Types.ObjectId;
  subject: string;
  messages: IMessageDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessageDocument>(
  {
    role: {
      type: String,
      enum: Object.values(MessageRole),
      required: true,
    },
    content: { type: String, required: true },
    mode: {
      type: String,
      enum: Object.values(LearningMode),
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true },
);

const conversationSchema = new Schema<IConversationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true, trim: true },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true },
);

export const ConversationModel = model<IConversationDocument>('Conversation', conversationSchema);
