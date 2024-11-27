import { Routes } from '@angular/router';
import { ExamsComponent } from './components/exams/exams.component';
import { ExamComponent } from './components/exam/exam.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { ClassComponent } from './components/class/class.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {path:'',component:LoginComponent},
  { path: 'user/student/exams', component: ExamsComponent },
  { path: 'user/student/exams/:id', component: ExamComponent },
  { path: 'user/professor/appointments', component: AppointmentsComponent },
  { path: 'login',component: LoginComponent },
];
