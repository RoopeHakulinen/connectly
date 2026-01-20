import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { alreadyLoggedInGuard } from './already-logged-in.guard';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TargetsComponent } from './targets/targets.component';
import { TargetDetailsComponent } from './targets/target-details/target-details.component';
import { TiersComponent } from './tiers/tiers.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [alreadyLoggedInGuard],
    component: LoginComponent,
  },
  {
    path: 'app',
    canActivate: [authGuard],
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'targets', component: TargetsComponent },
      { path: 'targets/:id', component: TargetDetailsComponent },
      { path: 'tiers', component: TiersComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
