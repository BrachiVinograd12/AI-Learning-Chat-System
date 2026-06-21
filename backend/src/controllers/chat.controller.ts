import { Request, Response, NextFunction } from 'express';
import { ApiResponse, CreateConversationRequest, SendMessageRequest } from '@ai-learning/shared';
import { ChatService } from '../services/chat.service';

const chatService = new ChatService();

export class ChatController {
  createConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: CreateConversationRequest = req.body;
      const conversation = await chatService.createConversation(req.user!.sub, input);
      const response: ApiResponse<typeof conversation> = { success: true, data: conversation };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const conversation = await chatService.getConversation(req.params.id, req.user!.sub);
      const response: ApiResponse<typeof conversation> = { success: true, data: conversation };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: SendMessageRequest = req.body;
      const conversation = await chatService.sendMessage(req.params.id, req.user!.sub, input);
      const response: ApiResponse<typeof conversation> = { success: true, data: conversation };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
