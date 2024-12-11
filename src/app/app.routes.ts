import { Routes } from '@angular/router';
import { ExamsComponent } from './components/exams/exams.component';
import { ExamComponent } from './components/exam/exam.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { redirectGuard } from './guards/redirect.guard';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: 'student/exams', component: ExamsComponent, canActivate: [authGuard], data: { requiredRole: 'student' } },
  { path: 'student/exams/:id', component: ExamComponent, canActivate: [authGuard], data: { requiredRole: 'student' } },
  { path: 'professor/appointments', component: AppointmentsComponent, canActivate: [authGuard], data: { requiredRole: 'professor' } },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: { requiredRole: 'admin' }},
  { path: 'login', component: LoginComponent },
  { path: '**', canActivate: [redirectGuard], component: LoginComponent },
];
