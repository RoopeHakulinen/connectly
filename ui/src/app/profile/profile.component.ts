import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  imports: [MatButtonToggleModule, MatCardModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private translateService = inject(TranslateService);

  currentLanguage = this.translateService.currentLang || 'en';

  changeLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.translateService.use(lang);
    localStorage.setItem('selectedLanguage', lang);
  }
}
