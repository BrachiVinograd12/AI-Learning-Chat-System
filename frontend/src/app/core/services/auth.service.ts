import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserRole,
} from '@ai-learning/shared';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'ai_learning_token';
const USER_KEY = 'ai_learning_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly userSignal = signal<User | null>(this.loadUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.getToken());
  readonly isAdmin = computed(() => this.userSignal()?.role === UserRole.Admin);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register`, data)
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, data)
      .pipe(tap((res) => this.handleAuthResponse(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.userSignal();
  }

  private handleAuthResponse(res: ApiResponse<AuthResponse>): void {
    if (res.success && res.data) {
      localStorage.setItem(TOKEN_KEY, res.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      this.userSignal.set(res.data.user);
    }
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
