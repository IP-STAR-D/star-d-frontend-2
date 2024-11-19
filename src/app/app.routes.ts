import { Routes } from '@angular/router';
import { ExamsComponent } from './components/exams/exams.component';
import { ExamComponent } from './components/exam/exam.component';

export const routes: Routes = [
  { path: 'user/student/exams', component: ExamsComponent },
  { path: 'user/student/exams/:id', component: ExamComponent },
];
