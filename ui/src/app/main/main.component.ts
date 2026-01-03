import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    TranslateModule,
  ],
})
export class MainComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map((result) => result.matches));

  navItems = [
    { path: 'dashboard', labelKey: 'NAV.DASHBOARD', icon: 'dashboard' },
    { path: 'targets', labelKey: 'NAV.TARGETS', icon: 'people' },
    { path: 'tiers', labelKey: 'NAV.TIERS', icon: 'layers' },
    { path: 'profile', labelKey: 'NAV.PROFILE', icon: 'person' },
  ];
}
