import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../../models/exam.model';
import { examsData } from '../../data/exam.data';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../models/user.model';
import { usersData } from '../../data/user.data';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-exam',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,HeaderComponent, MatGridListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, NgxMatTimepickerModule, MatButtonModule, MatIconModule],
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent {
  id: string | null = null;
  exams: Exam[] = examsData;
  users: User[] = usersData;
  exam: Exam | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    
    this.exam = this.exams.find(x => x.examId == Number(this.id))
  }

  getProfessor(professorId: number | undefined): User | null {
    const professor = this.users.find((p) => p.userId === professorId);
    return professor ? professor : null;
  }

  accept(): any {
    this.router.navigate([`user/student/exams`]);
  }

  decline(): any {
    this.router.navigate([`user/student/exams`]);
  }
}
