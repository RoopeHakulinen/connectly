import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
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
  private router = inject(Router);

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map((result) => result.matches));

  navItems = [
    { path: 'dashboard', labelKey: 'NAV.DASHBOARD', icon: 'dashboard' },
    { path: 'targets', labelKey: 'NAV.TARGETS', icon: 'people' },
    { path: 'tiers', labelKey: 'NAV.TIERS', icon: 'layers' },
    { path: 'profile', labelKey: 'NAV.PROFILE', icon: 'person' },
  ];

  currentTitleKey = signal('NAV.DASHBOARD');

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentPath = this.router.url.split('/')[1];
        const navItem = this.navItems.find((item) => item.path === currentPath);
        if (navItem) {
          this.currentTitleKey.set(navItem.labelKey);
        }
      });
  }
}
