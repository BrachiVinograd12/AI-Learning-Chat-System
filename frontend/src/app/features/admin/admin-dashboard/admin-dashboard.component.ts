import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AdminConversation,
  UsageStatistics,
  User,
} from '@ai-learning/shared';
import { AuthService } from '../../../core/services/auth.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  user = this.auth.getCurrentUser();
  stats: UsageStatistics | null = null;
  users: User[] = [];
  conversations: AdminConversation[] = [];
  loading = true;
  error: string | null = null;
  selectedUserId = '';

  constructor(
    private readonly auth: AuthService,
    private readonly adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getStatistics().subscribe({
      next: (res) => {
        if (res.success && res.data) this.stats = res.data;
      },
    });

    this.adminService.getUsers().subscribe({
      next: (res) => {
        if (res.success && res.data) this.users = res.data;
      },
    });

    this.loadConversations();
  }

  loadConversations(): void {
    this.adminService.getConversations(this.selectedUserId || undefined).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.conversations = res.data;
        } else {
          this.error = res.error?.message ?? 'Failed to load data';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not connect to the server';
      },
    });
  }

  onUserFilterChange(userId: string): void {
    this.selectedUserId = userId;
    this.loadConversations();
  }

  logout(): void {
    this.auth.logout();
  }
}
