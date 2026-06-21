import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiResponse } from '@ai-learning/shared';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  loading = false;
  error: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
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

    this.auth
      .register(this.form.getRawValue() as { name: string; email: string; password: string })
      .subscribe({
        next: (res) => {
          this.loading = false;

          if (res.success && res.data) {
            void this.router.navigateByUrl(this.auth.getPostLoginRoute(res.data.user));
            return;
          }

          this.error = res.error?.message ?? 'Registration failed';
        },
        error: (err) => {
          this.loading = false;
          const apiError = err.error as ApiResponse<null> | undefined;
          this.error = apiError?.error?.message ?? 'Could not connect to the server';
        },
      });
  }
}
