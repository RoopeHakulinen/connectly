import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Tier } from '../tiers.service';

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

@Component({
  selector: 'app-tier-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './tier-dialog.component.html',
  styleUrl: './tier-dialog.component.scss',
})
export class TierDialogComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<TierDialogComponent>);

  frequencies: Frequency[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

  form = this.fb.group({
    name: ['', Validators.required],
    frequency: ['WEEKLY' as Frequency, Validators.required],
    interval: [1, [Validators.required, Validators.min(1)]],
  });

  isEditMode = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { tier?: Tier }) {
    if (data?.tier) {
      this.isEditMode = true;
      const parsed = this.parseInterval(data.tier.interval);
      this.form.patchValue({
        name: data.tier.name,
        frequency: parsed.frequency,
        interval: parsed.interval,
      });
    }
  }

  private parseInterval(value: string): { frequency: Frequency; interval: number } {
    const freqMatch = value.match(/FREQ=(\w+)/i);
    const intervalMatch = value.match(/INTERVAL=(\d+)/i);

    return {
      frequency: (freqMatch ? freqMatch[1].toUpperCase() : 'WEEKLY') as Frequency,
      interval: intervalMatch ? parseInt(intervalMatch[1], 10) : 1,
    };
  }

  private buildInterval(): string {
    const { frequency, interval } = this.form.value;
    return `FREQ=${frequency};INTERVAL=${interval}`;
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close({
        name: this.form.value.name,
        interval: this.buildInterval(),
      });
    }
  }
}
