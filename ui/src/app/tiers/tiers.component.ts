import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateTierDto, Tier, TiersService, UpdateTierDto } from './tiers.service';
import { TierDialogComponent } from './tier-dialog/tier-dialog.component';
import { RecurrencePipe } from '../shared/pipes/recurrence.pipe';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-tiers',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RecurrencePipe,
    TranslateModule,
  ],
  templateUrl: './tiers.component.html',
  styleUrl: './tiers.component.scss',
})
export class TiersComponent {
  private tiersService = inject(TiersService);
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  tiers$ = this.tiersService.getTiers();

  createMutation = this.tiersService.createTier();
  updateMutation = this.tiersService.updateTier();
  deleteMutation = this.tiersService.deleteTier();

  openDialog(tier?: Tier) {
    const dialogRef = this.dialog.open(TierDialogComponent, {
      data: { tier },
      width: '100%',
      maxWidth: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (tier) {
          const dto: UpdateTierDto = result;
          this.updateMutation.mutate({ id: tier.id, dto });
        } else {
          const dto: CreateTierDto = result;
          this.createMutation.mutate(dto);
        }
      }
    });
  }

  delete(tier: Tier) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('TIERS.DELETE.TITLE'),
        message: this.translate.instant('TIERS.DELETE.MESSAGE'),
        confirmText: this.translate.instant('COMMON.DELETE'),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteMutation.mutate(tier.id);
      }
    });
  }
}
