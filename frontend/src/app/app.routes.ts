import { Routes } from '@angular/router';
import {
  adminGuard,
  authGuard,
  guestGuard,
  studentGuard,
} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, studentGuard],
    loadComponent: () =>
      import('./features/dashboard/student-dashboard/student-dashboard.component').then(
        (m) => m.StudentDashboardComponent,
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent,
      ),
  },
  {
    path: 'chat',
    canActivate: [authGuard, studentGuard],
    loadComponent: () =>
      import('./features/chat/chat.component').then((m) => m.ChatComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'login' },
];
