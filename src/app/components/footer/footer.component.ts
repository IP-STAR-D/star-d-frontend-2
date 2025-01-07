import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { SemesterService } from '../../services/semester.service';

import { Semester } from '../../models/semester.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  isNotLogin: boolean = true;
  semesterInfo: Semester | undefined;
  gettingSemesterData: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private semesterService: SemesterService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isNotLogin = this.router.url !== '/login';

      if (this.router.url === '/login') {
        this.semesterInfo = undefined;
      }

      if (this.authService.getToken() && !this.gettingSemesterData) {
        this.loadCurrentSemester();
      }
    });
  }

  loadCurrentSemester(): void {
    this.gettingSemesterData = true;
    this.semesterService.getCurrentSemester().subscribe({
      next: (data: Semester) => {
        this.semesterInfo = data;
        this.gettingSemesterData = false;
      },
      error: (err) => {
        console.error('Eroare la preluarea semestrului curent:', err);
        this.snackBarService.show('Eroare la preluarea semestrului curent!', 'error');
        this.gettingSemesterData = false;
      },
    });
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
