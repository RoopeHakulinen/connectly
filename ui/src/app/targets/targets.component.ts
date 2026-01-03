import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  CreateTargetDto,
  Target,
  TargetsService,
  UpdateTargetDto,
} from '../targets.service';
import { TargetDialogComponent } from './target-dialog/target-dialog.component';
import { RecurrencePipe } from '../shared/pipes/recurrence.pipe';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-targets',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RecurrencePipe,
  ],
  templateUrl: './targets.component.html',
  styleUrl: './targets.component.scss',
})
export class TargetsComponent {
  private targetsService = inject(TargetsService);
  private dialog = inject(MatDialog);

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
        title: 'Delete Target',
        message: `Are you sure you want to delete ${target.name}?`,
        confirmText: 'Delete',
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
}
