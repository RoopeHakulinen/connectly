import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Theme, ThemeService } from '../shared/services/theme.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { PushNotificationService } from '../shared/services/push-notification.service';
@Component({
  selector: 'app-profile',
  imports: [
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    TranslateModule,
    MatSlideToggleModule,
    CommonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private translateService = inject(TranslateService);
  protected themeService = inject(ThemeService);
  private pushService = inject(PushNotificationService);

  currentLanguage = this.translateService.currentLang || 'en';
  isSubscribed = false;
  permissionStatus: NotificationPermission = 'default';

  constructor() {
    this.checkPushStatus();
  }

  async checkPushStatus() {
    this.isSubscribed = await this.pushService.isSubscribed();
    this.permissionStatus = this.pushService.getPermissionStatus();
  }

  async toggleNotifications(enabled: boolean) {
    if (enabled) {
      const success = await this.pushService.subscribe();
      if (success) {
        this.isSubscribed = true;
      }
    } else {
      const success = await this.pushService.unsubscribe();
      if (success) {
        this.isSubscribed = false;
      }
    }
    this.permissionStatus = this.pushService.getPermissionStatus();
  }

  changeLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.translateService.use(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  changeTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
