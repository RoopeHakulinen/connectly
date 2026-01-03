import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TiersService } from '../../tiers/tiers.service';
import { Target, TargetType } from '../../targets.service';
import { RecurrencePipe } from '../../shared/pipes/recurrence.pipe';

@Component({
  selector: 'app-target-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    AsyncPipe,
    RecurrencePipe,
    TranslateModule,
  ],
  templateUrl: './target-dialog.component.html',
  styleUrl: './target-dialog.component.scss',
})
export class TargetDialogComponent {
  private fb = inject(FormBuilder);
  private tiersService = inject(TiersService);
  public dialogRef = inject(MatDialogRef<TargetDialogComponent>);

  tiers$ = this.tiersService.getTiers();

  targetTypes: TargetType[] = ['FRIEND', 'TASK'];

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['FRIEND' as TargetType, Validators.required],
    tierId: [null as number | null, Validators.required],
    notes: [''],
    notificationEnabled: [false],
  });

  isEditMode = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { target?: Target }) {
    if (data?.target) {
      this.isEditMode = true;
      this.form.patchValue({
        name: data.target.name,
        type: data.target.type,
        tierId: data.target.tier?.id,
        notes: data.target.notes,
        notificationEnabled: data.target.notificationEnabled,
      });
    }
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
