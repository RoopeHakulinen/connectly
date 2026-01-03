import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Theme, ThemeService } from '../shared/services/theme.service';

@Component({
  selector: 'app-profile',
  imports: [MatButtonToggleModule, MatCardModule, MatIconModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private translateService = inject(TranslateService);
  protected themeService = inject(ThemeService);

  currentLanguage = this.translateService.currentLang || 'en';

  changeLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.translateService.use(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  changeTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
