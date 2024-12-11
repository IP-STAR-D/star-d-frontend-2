import { Component, OnInit } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';

registerLocaleData(localeRo);

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [{ provide: LOCALE_ID, useValue: 'ro' }],
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}
  isLoading = true;

  ngOnInit() {
    this.authService.loadAuthState().then(() => {
      if (this.authService.isAuthenticated()) {
        this.isLoading = false; 
      }
    });
}
  title = 'star-d-frontend';
}
