import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminConversation,
  ApiResponse,
  UsageStatistics,
  User,
} from '@ai-learning/shared';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/users`);
  }

  getConversations(userId?: string): Observable<ApiResponse<AdminConversation[]>> {
    const params = userId ? { userId } : undefined;
    return this.http.get<ApiResponse<AdminConversation[]>>(`${this.baseUrl}/conversations`, {
      params,
    });
  }

  getStatistics(): Observable<ApiResponse<UsageStatistics>> {
    return this.http.get<ApiResponse<UsageStatistics>>(`${this.baseUrl}/stats`);
  }
}
