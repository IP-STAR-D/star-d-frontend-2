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
import { GroupService } from '../../services/group.service';
import { Group } from '../../models/group.model';
import { DegreeService } from '../../services/degree.service';
import { Degree } from '../../models/degree.model';
import { AppSettingService } from '../../services/app-setting.service';
import { AppSetting } from '../../models/app-setting.model';

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
  groups: Group[] = [];
  degrees: Degree[] = [];

  filteredExams: Exam[] = [];
  groupFilter: string = '';
  degreeFilter: string = ''; 
  yearFilter: string = '';
  isVisible: boolean = true;
  isEmailEnabled: boolean = false;

  constructor(
    private router: Router,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private professorService: ProfessorService,
    private userService: UserService,
    private statusTranslationService: StatusTranslationService,
    private snackBarService: SnackBarService,
    private studentService: StudentService,
    private classroomService: ClassroomService,
    private groupService: GroupService,
    private degreeService: DegreeService,
    private appSettingService: AppSettingService
  ) {}

  ngOnInit(): void {
    this.loadExams();
    this.loadAppointments();
    this.loadGroups();
    this.loadDegrees();
    this.loadInitialSettings();
  }

  applyFilters(): void {
    this.filteredExams = this.exams.filter((exam) => {
      const matchesDegree = this.degreeFilter ? exam.degreeId === Number(this.degreeFilter) : true;
      const matchesYear = this.yearFilter ? exam.year === Number(this.yearFilter) : true;
      return matchesDegree && matchesYear;
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

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (data: Group[]) => {
        this.groups = data;
      },
      error: (err) => {
        console.error('Eroare la preluarea grupelor:', err);
        this.snackBarService.show('Eroare la preluarea grupelor!', 'error');
      }
    })
  }

  loadDegrees(): void {
    this.degreeService.getDegrees().subscribe({
      next: (data: Degree[]) => {
        this.degrees = data;
      },
      error: (err) => {
        console.error('Eroare la preluarea specializarilor:', err);
        this.snackBarService.show('Eroare la preluarea specializarilor!', 'error');
      }
    })
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

  loadInitialSettings(): void {
    this.appSettingService.getSettings().subscribe({
      next: (response: AppSetting[]) => {
        const sendEmailsSetting = response.find((setting) => setting.name === 'sendEmails');
        if (sendEmailsSetting && sendEmailsSetting.value !== undefined) {
          this.isEmailEnabled = sendEmailsSetting.value;
        } else {
          this.snackBarService.show('Setarea "sendEmails" nu a fost găsită sau este invalidă!', 'error');
        }
      },
      error: () => {
        this.snackBarService.show('Eroare la preluarea setărilor!', 'error');
      },
    });
  }

  toggleEmailSetting(): void {
    const updatedSetting = !this.isEmailEnabled;
    this.appSettingService.updateAppSetting('sendEmails', {name: 'sendEmails', value: updatedSetting}).subscribe({
      next: () => {
        this.isEmailEnabled = updatedSetting;
        const message = updatedSetting
          ? 'Trimiterea de emailuri a fost activată!'
          : 'Trimiterea de emailuri a fost dezactivată!';
        this.snackBarService.show(message, 'success');
      },
      error: () => {
        this.snackBarService.show('Eroare la actualizarea setărilor!', 'error');
      },
    });
  }
}
