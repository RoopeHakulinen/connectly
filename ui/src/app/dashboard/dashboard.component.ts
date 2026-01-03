import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  upcomingTargets$ = inject(DashboardService).getUpcomingDeadlines();
  private translate = inject(TranslateService);

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
      if (overdueDays === 0) return this.translate.instant('DASHBOARD.DEADLINE.TODAY');
      if (overdueDays === 1) return this.translate.instant('DASHBOARD.DEADLINE.OVERDUE_DAY');
      return this.translate.instant('DASHBOARD.DEADLINE.OVERDUE_DAYS', { count: overdueDays });
    }

    if (diffDays === 0) return this.translate.instant('DASHBOARD.DEADLINE.TODAY');
    if (diffDays === 1) return this.translate.instant('DASHBOARD.DEADLINE.TOMORROW');
    if (diffDays < 7) return this.translate.instant('DASHBOARD.DEADLINE.DAYS', { count: diffDays });
    if (diffDays < 14) return this.translate.instant('DASHBOARD.DEADLINE.WEEK');
    return this.translate.instant('DASHBOARD.DEADLINE.WEEKS', { count: Math.floor(diffDays / 7) });
  }
}
