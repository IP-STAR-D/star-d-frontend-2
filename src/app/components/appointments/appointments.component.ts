import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';
import { Exam } from '../../models/exam.model';
import { Group } from '../../models/group.model';
import { AppointmentModal } from '../modal/modal.component';
import { ExamService } from '../../services/exam.service';
import { AppointmentsService } from '../../services/appointment.service';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { StatusTranslationService } from '../../services/translation.service';
import { FormsModule } from '@angular/forms';
import { SnackBarService } from '../../services/snack-bar.service';
import { DegreeService } from '../../services/degree.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  users: User[] = [];
  exams: Exam[] = [];
  groups: Group[] = [];
  professorId: number | null = null;
  showTooltip = false;
  tooltipX = 0;
  tooltipY = 0;

  statusFilter: string = ''; // Filtrul pentru status
  examFilter: string = ''; // Filtrul pentru materie
  dateFilter: string | null = null; // Filtrul pentru dată (format ISO: 'YYYY-MM-DD')
  degreeFilter: string = ''; // Filtrul pentru degree
degrees: any[] = []; // Lista de specializări asociate profesorului

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private statusTranslationService: StatusTranslationService,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private groupService: GroupService,
    private degreeService: DegreeService
  ) { }

  ngOnInit(): void {
    this.loadMyAppointments();
    this.loadExamsByProfessor();
    this.loadGroupsByProfessor();
    this.loadDegreesByProfessor(); // Noua metodă pentru a încărca specializările
  }  

  openDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentModal, {
      data: { appointment, exam: this.getExam(appointment.examId) },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateStatus(appointment, result.status);
      }
    });
  }

  loadDegreesByProfessor(): void {
    this.professorId = Number(this.authService.getUserId());
  
    if (!this.professorId) {
      this.snackBarService.show('Profesorul are ID invalid!', 'error');
      return;
    }
  
    this.degreeService.getDegrees().subscribe({
      next: (degrees: any[]) => {
        // Obținem examenele filtrate pentru profesorul logat
        const filteredExams = this.exams.filter((exam) => exam.professorId === this.professorId);
  
        // Extragem degreeId-urile unice din examenele filtrate
        const degreeIds = new Set(filteredExams.map((exam) => exam.degreeId));
  
        // Filtrăm gradele care se potrivesc cu degreeId-urile asociate profesorului
        this.degrees = degrees.filter((degree) => degreeIds.has(degree.degreeId));
      },
      error: () => {
        this.snackBarService.show('Eroare la preluarea specializărilor!', 'error');
      },
    });
  }  

  loadExamsByProfessor(): void {
    this.professorId = Number(this.authService.getUserId());

    if (!this.professorId) {
      this.snackBarService.show('Profesorul are ID invalid!', 'error');
      return;
    }

    this.examService.getExamsByProfessorId(this.professorId).subscribe({
      next: (data: Exam[]) => {
        this.exams = data;
      },
      error: () => {
        this.snackBarService.show('Eroare preluarea exemenelor!', 'error');
      },
    });
  }

  loadGroupsByProfessor(): void {
    this.professorId = Number(this.authService.getUserId());

    if (!this.professorId) {
      this.snackBarService.show('Profesorul are ID invalid!', 'error');
      return;
    }

    this.groupService.getGroupsByProfessorId(this.professorId).subscribe({
      next: (data: Group[]) => {
        this.groups = data;
      },
      error: () => {
        this.snackBarService.show('Eroare preluarea exemenelor!', 'error');
      },
    });
  }

  getExam(examId: number): Exam | null {
    return this.exams.find((exam) => exam.examId === examId) || null;
  }

  getGroup(groupId: number): Group | null {
    return this.groups.find((group) => group.groupId === groupId) || null;
  }

  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter((appointment) => {
      const matchesStatus =
        this.statusFilter === '' || appointment.status.toLowerCase() === this.statusFilter.toLowerCase();
  
      const matchesExam = this.examFilter === '' || appointment.examId === Number(this.examFilter);
  
      const matchesDegree = this.degreeFilter === '' || this.getExam(appointment.examId)?.degreeId === Number(this.degreeFilter);
  
      const matchesDate = this.dateFilter
        ? new Date(appointment.startTime).toISOString().split('T')[0] === this.dateFilter
        : true;
  
      return matchesStatus && matchesExam && matchesDegree && matchesDate;
    });
  }

  onStatusFilterChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onExamFilterChange(event: Event): void {
    this.examFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onDateFilterChange(event: string | null): void {
    this.dateFilter = event;
    this.applyFilters();
  }

  loadMyAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: any[]) => {
        this.appointments = data.map(
          (item) =>
            new Appointment(
              item.appointment_id,
              item.exam_id,
              item.group_id,
              item.status,
              new Date(item.start_time),
              new Date(item.end_time),
              item.classroom_id
            )
        );
        this.filteredAppointments = [...this.appointments];
      },
      error: () => {
        this.snackBarService.show('Eroare preluarea exmenelor', 'error');
      },
    });
  }

  onMouseMove(event: MouseEvent) {
    this.showTooltip = true;
    this.tooltipX = event.clientX + 10;
    this.tooltipY = event.clientY + 10;
  }

  hideTooltip() {
    this.showTooltip = false;
  }

  updateStatus(appointment: Appointment, status: string) {
    appointment.status = status;

    this.appointmentService.updateAppointment(appointment.appointmentId, appointment).subscribe(
      () => {
        this.snackBarService.show('Am modificat cererea!', 'success');
      },
      () => {
        this.snackBarService.show('Nu am modificat cererea!', 'error');
      }
    );
  }

  getStatusTranslation(status: string): string {
    return this.statusTranslationService.getStatusTranslation(status);
  }

}
