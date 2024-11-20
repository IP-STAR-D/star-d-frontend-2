import { Routes } from '@angular/router';
import { ExamsComponent } from './components/exams/exams.component';
import { ExamComponent } from './components/exam/exam.component';
import { ClassesComponent } from './components/classes/classes.component';
import { ClassComponent } from './components/class/class.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {path:'',component:LoginComponent},
  { path: 'user/student/exams', component: ExamsComponent },
  { path: 'user/student/exams/:id', component: ExamComponent },
  { path: 'user/professor/classes', component: ClassesComponent },
  { path: 'user/professor/classes/:id', component: ClassComponent },
  {path: 'login',component:LoginComponent},
];
