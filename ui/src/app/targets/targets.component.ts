import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateTargetDto, Target, TargetsService, UpdateTargetDto } from '../targets.service';
import { TargetDialogComponent } from './target-dialog/target-dialog.component';
import { RecurrencePipe } from '../shared/pipes/recurrence.pipe';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-targets',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RecurrencePipe,
    TranslateModule,
  ],
  templateUrl: './targets.component.html',
  styleUrl: './targets.component.scss',
})
export class TargetsComponent {
  private targetsService = inject(TargetsService);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  targets$ = this.targetsService.getTargets();

  createMutation = this.targetsService.createTarget();
  updateMutation = this.targetsService.updateTarget();
  deleteMutation = this.targetsService.deleteTarget();

  openDialog(target?: Target) {
    const dialogRef = this.dialog.open(TargetDialogComponent, {
      data: { target },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (target) {
          const dto: UpdateTargetDto = result;
          this.updateMutation.mutate({ id: target.id, dto });
        } else {
          const dto: CreateTargetDto = result;
          this.createMutation.mutate(dto);
        }
      }
    });
  }

  delete(target: Target) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('TARGETS.DELETE.TITLE'),
        message: this.translate.instant('TARGETS.DELETE.MESSAGE', { name: target.name }),
        confirmText: this.translate.instant('COMMON.DELETE'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteMutation.mutate(target.id);
      }
    });
  }

  getIconForType(type: string): string {
    return type === 'FRIEND' ? 'person' : 'task_alt';
  }

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
}
