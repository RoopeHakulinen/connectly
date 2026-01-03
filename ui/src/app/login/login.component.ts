import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
  imports: [MatButtonToggleModule, MatIconModule, TranslateModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private translateService = inject(TranslateService);

  currentLanguage = this.translateService.currentLang || 'en';

  login(): void {
    this.authService.login();
  }

  changeLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.translateService.use(lang);
    localStorage.setItem('selectedLanguage', lang);
  }
}
