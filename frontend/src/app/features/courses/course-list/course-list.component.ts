import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '@ai-learning/shared';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  error: string | null = null;

  constructor(private readonly courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.courses = response.data;
        } else {
          this.error = response.error?.message ?? 'Failed to load courses';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not connect to the backend';
        this.loading = false;
      },
    });
  }
}
