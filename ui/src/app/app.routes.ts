import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
