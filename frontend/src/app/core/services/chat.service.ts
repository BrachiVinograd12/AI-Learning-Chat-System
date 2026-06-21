import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  Conversation,
  CreateConversationRequest,
  SendMessageRequest,
} from '@ai-learning/shared';
import { environment } from '../../../environments/environment';

export interface StoredConversation {
  id: string;
  subject: string;
  updatedAt: string;
}

const CONVERSATIONS_KEY = 'ai_learning_conversations';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = `${environment.apiUrl}/chat`;

  constructor(private readonly http: HttpClient) {}

  createConversation(
    data: CreateConversationRequest,
  ): Observable<ApiResponse<Conversation>> {
    return this.http.post<ApiResponse<Conversation>>(
      `${this.baseUrl}/conversations`,
      data,
    );
  }

  getConversation(id: string): Observable<ApiResponse<Conversation>> {
    return this.http.get<ApiResponse<Conversation>>(
      `${this.baseUrl}/conversations/${id}`,
    );
  }

  sendMessage(
    conversationId: string,
    data: SendMessageRequest,
  ): Observable<ApiResponse<Conversation>> {
    return this.http.post<ApiResponse<Conversation>>(
      `${this.baseUrl}/conversations/${conversationId}/messages`,
      data,
    );
  }

  getStoredConversations(): StoredConversation[] {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as StoredConversation[];
    } catch {
      return [];
    }
  }

  saveConversation(conversation: Conversation): void {
    const list = this.getStoredConversations().filter((c) => c.id !== conversation.id);
    list.unshift({
      id: conversation.id,
      subject: conversation.subject,
      updatedAt: conversation.updatedAt,
    });
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list.slice(0, 50)));
  }

  removeConversation(id: string): void {
    const list = this.getStoredConversations().filter((c) => c.id !== id);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list));
  }
}
