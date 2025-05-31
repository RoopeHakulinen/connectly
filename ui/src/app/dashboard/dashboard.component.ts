import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Target, TargetsService } from '../targets.service';
import { QueryObserverResult } from '@ngneat/query';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-dashboard',
    imports: [AsyncPipe, MatButton, MatDivider],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  targets$: Observable<QueryObserverResult<Target[]>> =
    inject(TargetsService).getTargets();
}
