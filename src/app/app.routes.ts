import { Routes } from '@angular/router';
import { ExamsComponent } from './components/exams/exams.component';
import { ExamComponent } from './components/exam/exam.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { ClassComponent } from './components/class/class.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {path:'',component:LoginComponent},
  { path: 'user/student/exams', component: ExamsComponent,canActivate:[AuthGuard] },
  { path: 'user/student/exams/:id', component: ExamComponent,canActivate:[AuthGuard]  },
  { path: 'user/professor/appointments', component: AppointmentsComponent,canActivate:[AuthGuard]  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
