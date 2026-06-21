import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading = false;
  error: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.router.navigate([this.auth.isAdmin() ? '/admin' : '/dashboard']);
        } else {
          this.error = res.error?.message ?? 'Login failed';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not connect to the server';
      },
    });
  }
}
