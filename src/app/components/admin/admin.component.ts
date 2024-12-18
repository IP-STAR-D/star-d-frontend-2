import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Exam } from '../../models/exam.model';
import { Appointment } from '../../models/appointment.model';
import { ExamService } from '../../services/exam.service';
import { AppointmentsService } from '../../services/appointment.service';
import { StatusTranslationService } from '../../services/translation.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { ClassroomService } from '../../services/classroom.service';
import { MatCardModule } from '@angular/material/card';
import { Classroom } from '../../models/classroom.model';
import { User } from '../../models/user.model';
import { ProfessorService } from '../../services/professor.service';
import { StudentService } from '../../services/student.service';
import { UserService } from '../../services/user.service';
import { Professor } from '../../models/professor.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, MatCardModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  exams: Exam[] = [];
  appointments: Appointment[] = [];
  professors: Professor[] = [];
  classrooms: Classroom[] = [];

  filteredExams: Exam[] = [];
  statusFilter: string = '';
  classFilter: string = ''; // Variabila pentru grupă
  isVisible: boolean = true;

  constructor(
    private router: Router,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private professorService: ProfessorService,
    private userService: UserService,
    private statusTranslationService: StatusTranslationService,
    private snackBarService: SnackBarService,
    private studentService: StudentService,
    private classroomService: ClassroomService
  ) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadAppointments();
    this.loadClassrooms(); // Asigură-te că grupele sunt încărcate
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter((exam) => {
      const appointment = this.getAppointmentsForExam(exam.examId);
      const matchesStatus = this.statusFilter
        ? appointment && appointment.status.toLowerCase() === this.statusFilter
        : true;
      const matchesClass = this.classFilter
        ? appointment && appointment.classroomId === Number(this.classFilter)
        : true;
      return matchesStatus && matchesClass;
    });
  }

  loadExams(): void {
    this.examService.getExams().subscribe({
      next: (data: Exam[]) => {
        this.exams = data;
        this.applyFilters();
      },
      error: (err) => {
        this.snackBarService.show('Eroare la preluarea examenelor!', 'error');
      },
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.appointments = data;
        this.applyFilters();
      },
      error: (err) => {
        this.snackBarService.show('Eroare la preluarea programarilor!', 'error');
      },
    });
  }

  loadClassrooms(): void {
    this.classroomService.getClassrooms().subscribe({
      next: (data: Classroom[]) => {
        this.classrooms = data;
      },
      error: (err) => {
        console.error('Eroare la preluarea salilor:', err);
        this.snackBarService.show('Eroare la preluarea salilor!', 'error');
      },
    });
  }

  getUserForProfessor(userId: number): User | null {
    let user: User | null = null;
    this.userService.getUserById(userId).subscribe({
      next: (data: User) => {
        user = data;
      },
      error: (err) => {
        this.snackBarService.show('Eroare la preluarea utilizatorului!', 'error');
      },
    });
    return user;
  }

  getAppointmentsForExam(examId: number): Appointment | null {
    const priorityStatuses = ['scheduled', 'pending', 'rejected'];

    for (const status of priorityStatuses) {
      const filteredAppointments = this.appointments.filter(
        (appointment) => appointment.examId === examId && appointment.status.toLowerCase() === status
      );
      if (filteredAppointments.length > 0) {
        return filteredAppointments[0];
      }
    }

    return null;
  }

  getClassroomName(classroomId: number): string {
    const classroom = this.classrooms.find((classroom) => classroom.classroomId === classroomId);
    return classroom ? classroom.classroomName : '';
  }

  getStatusTranslation(status: string): string {
    return this.statusTranslationService.getStatusTranslation(status);
  }

  getTypeTranslation(type: string): string {
    return this.statusTranslationService.getTypeTranslation(type);
  }

  redirectToExam(examId: number): void {
    this.studentService.isStudentBoss().subscribe({
      next: (response) => {
        if (response.isBoss) {
          this.router.navigate([`student/exams/${examId}`]);
        } else {
          this.snackBarService.show('Doar sefii de grupa pot accesa aceasta pagina!', 'error');
        }
      },
      error: () => {
        this.snackBarService.show('Eroare la verificarea permisiunilor!', 'error');
      },
    });
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
    this.applyFilters(); // Reaplică filtrele după schimbarea vizibilității
  }
}
