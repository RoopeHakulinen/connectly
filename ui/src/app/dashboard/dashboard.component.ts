import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService, UpcomingTarget } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  upcomingTargets$ = inject(DashboardService).getUpcomingDeadlines();

  getIconForType(type: string): string {
    return type === 'FRIEND' ? 'person' : 'task_alt';
  }

  getRelativeDeadline(target: UpcomingTarget): string {
    const deadline = new Date(target.deadline);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (target.isOverdue) {
      const overdueDays = Math.abs(diffDays);
      if (overdueDays === 0) return 'Due today';
      if (overdueDays === 1) return '1 day overdue';
      return `${overdueDays} days overdue`;
    }

    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `Due in ${diffDays} days`;
    if (diffDays < 14) return 'Due in 1 week';
    return `Due in ${Math.floor(diffDays / 7)} weeks`;
  }
}
