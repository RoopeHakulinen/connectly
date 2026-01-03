import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TargetsService } from '../targets.service';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-dashboard',
    imports: [AsyncPipe, MatButton, MatDivider],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  targets$ = inject(TargetsService).getTargets();
}
