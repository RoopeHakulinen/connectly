import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs';
import { TargetsService } from '../../targets.service';
import { RecurrencePipe } from '../../shared/pipes/recurrence.pipe';

@Component({
  selector: 'app-target-details',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatListModule,
    TranslateModule,
    RecurrencePipe,
  ],
  templateUrl: './target-details.component.html',
  styleUrl: './target-details.component.scss',
})
export class TargetDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private targetsService = inject(TargetsService);

  target$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.targetsService.getTarget(id)),
  );

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
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

  getActivityIcon(type: string): string {
    switch (type) {
      case 'CALL':
        return 'phone';
      case 'MESSAGE':
        return 'chat';
      default:
        return 'event';
    }
  }

  goBack(): void {
    this.router.navigate(['/app/targets']);
  }
}
