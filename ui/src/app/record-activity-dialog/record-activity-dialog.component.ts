import { Component, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';

export type ActivityType = 'CALL' | 'MESSAGE' | 'OTHER';

export interface RecordActivityDialogData {
  targetId: number;
  targetName: string;
}

export interface RecordActivityDialogResult {
  type: ActivityType;
  timestamp: Date;
}

@Component({
  selector: 'app-record-activity-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    TranslateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './record-activity-dialog.component.html',
  styleUrl: './record-activity-dialog.component.scss',
})
export class RecordActivityDialogComponent {
  private dialogRef = inject(MatDialogRef<RecordActivityDialogComponent>);
  data: RecordActivityDialogData = inject(MAT_DIALOG_DATA);

  activityTypes: ActivityType[] = ['CALL', 'MESSAGE', 'OTHER'];

  form = new FormGroup({
    type: new FormControl<ActivityType>('CALL', { nonNullable: true, validators: [Validators.required] }),
    timestamp: new FormControl<Date>(new Date(), { nonNullable: true, validators: [Validators.required] }),
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        type: this.form.value.type,
        timestamp: this.form.value.timestamp,
      } as RecordActivityDialogResult);
    }
  }
}
