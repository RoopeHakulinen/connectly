import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DashboardService, UpcomingTarget } from './dashboard.service';
import {
  RecordActivityDialogComponent,
  RecordActivityDialogData,
  RecordActivityDialogResult,
} from '../record-activity-dialog/record-activity-dialog.component';
import { TargetsService } from '../targets.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    DatePipe,
    NgClass,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  upcomingTargets$ = inject(DashboardService).getUpcomingDeadlines();
  private translate = inject(TranslateService);
  private dialog = inject(MatDialog);
  private targetsService = inject(TargetsService);

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#E53935', '#D81B60', '#8E24AA', '#5E35B1',
      '#3949AB', '#1E88E5', '#039BE5', '#00ACC1',
      '#00897B', '#43A047', '#7CB342', '#C0CA33',
      '#FDD835', '#FFB300', '#FB8C00', '#F4511E',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getRelativeDeadline(target: UpcomingTarget): string {
    if (!target.lastActivity) {
      return this.translate.instant('DASHBOARD.DEADLINE.CONTACT_NOW');
    }

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

  getDeadlineStatusClass(target: UpcomingTarget): string {
    if (target.isOverdue) return 'status-overdue';

    if (!target.deadline) return '';

    const deadline = new Date(target.deadline);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays <= 3) {
      return 'status-warning';
    } else {
      return 'status-ok';
    }
  }

  formatDeadline(deadline: string): string {
    return new Date(deadline).toLocaleString();
  }

  openRecordActivityDialog(target: UpcomingTarget): void {
    const dialogRef = this.dialog.open<
      RecordActivityDialogComponent,
      RecordActivityDialogData,
      RecordActivityDialogResult
    >(RecordActivityDialogComponent, {
      data: {
        targetId: target.id,
        targetName: target.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.targetsService.createActivity(target.id, {
          type: result.type,
          timestamp: result.timestamp.toISOString(),
        });
      }
    });
  }
}
