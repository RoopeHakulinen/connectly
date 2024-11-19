import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
        component: MainComponent,
        children: [{ path: '', component: DashboardComponent }],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
