import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { provideNativeDateAdapter, MatOptionModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Appointment, Matches, FilteredAppointmentsResponse } from '../../models/appointment.model';
import { Exam } from '../../models/exam.model';
import { Classroom } from '../../models/classroom.model';
import { Student } from '../../models/student.model';

import { AppointmentsService } from '../../services/appointment.service';
import { ExamService } from '../../services/exam.service';
import { ClassroomService } from '../../services/classroom.service';
import { StudentService } from '../../services/student.service';
import { StatusTranslationService } from '../../services/status.service';

import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component';

@Component({
  selector: 'app-exam',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    CommonModule,
    FormsModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
    NgxMatTimepickerModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  host: { '[style.--sys-inverse-surface]': 'red' },
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent {
  id: number | null = null;
  exam: Exam | null = null;
  appointments: Appointment[] = [];
  appointmentsMatches: Matches[] = [];
  myAppointments: Appointment[] = [];
  classrooms: Classroom[] = [];

  selectedDate: string | null = null;
  selectedTimeStart: string | null = null;
  selectedTimeEnd: string | null = null;
  classroomId: number | null = null;

  minTime: string = '08:00';
  maxTime: string = '22:00';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private classroomService: ClassroomService,
    private studentService: StudentService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private statusTranslationService: StatusTranslationService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExam();
    this.loadClassrooms();
    this.loadMyAppointments();
  }

  loadExam(): void {
    if (!this.id) return;

    this.examService.getExamById(this.id).subscribe({
      next: (data: Exam) => {
        this.exam = data;
      },
      error: (err) => {
        console.error('Eroare la preluarea examenului:', err);
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
      },
    });
  }

  loadAppointments(): void {
    if (!this.selectedDate) {
      return;
    }

    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')?.toString();

    this.appointmentService
      .getAppointmentsByFilters({
        professorId: this.exam?.professorId ?? undefined,
        classroomId: this.classroomId ?? undefined,
        day: formattedDate ?? undefined,
      })
      .subscribe({
        next: (data: FilteredAppointmentsResponse) => {
          this.appointments = data.appointments.filter((appointment) => appointment.status === 'scheduled');
          this.appointmentsMatches = data.matches;
        },
        error: (err) => {
          if (err.status === 404) {
            this.appointments = [];
            this.appointmentsMatches = [];
          } else {
            console.error('Eroare la preluarea programarilor:', err);
          }
        },
      });
  }

  loadMyAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.myAppointments = data;
      },
      error: (err) => {
        console.error('Eroare la preluarea programarilor:', err);
      },
    });
  }

  // Validators
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const inputValue = control.value;
    if (inputValue && new Date(inputValue) <= new Date()) {
      return { invalidDate: true };
    }
    return null;
  }
  timeStartValidator(control: AbstractControl): ValidationErrors | null {
    const inputValue = control.value;
    if (inputValue && this.selectedTimeEnd && inputValue >= this.selectedTimeEnd) {
      return { invalidTime: true };
    }
    return null;
  }
  timeEndValidator(control: AbstractControl): ValidationErrors | null {
    const inputValue = control.value;
    if (inputValue && this.selectedTimeStart && inputValue <= this.selectedTimeStart) {
      return { invalidTime: true };
    }
    return null;
  }
  timeOverlapValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.selectedDate || !this.selectedTimeStart || !this.selectedTimeEnd || !this.appointments) {
      return null;
    }

    const selectedStart = new Date(this.selectedDate);
    const [startHour, startMinute] = this.selectedTimeStart.split(':').map(Number);
    selectedStart.setHours(startHour, startMinute, 0, 0);

    const selectedEnd = new Date(this.selectedDate);
    const [endHour, endMinute] = this.selectedTimeEnd.split(':').map(Number);
    selectedEnd.setHours(endHour, endMinute, 0, 0);

    for (const appointment of this.appointments) {
      const appointmentStart = new Date(appointment.startTime);
      const appointmentEnd = new Date(appointment.endTime);

      if (
        (selectedStart >= appointmentStart && selectedStart < appointmentEnd) ||
        (selectedEnd > appointmentStart && selectedEnd <= appointmentEnd) ||
        (selectedStart <= appointmentStart && selectedEnd >= appointmentEnd)
      ) {
        return { timeOverlap: true };
      }
    }

    return null;
  }

  // Form Controls
  dateFormControl = new FormControl('', [Validators.required, this.futureDateValidator]);
  timeStartFormControl = new FormControl('', [
    Validators.required,
    this.timeStartValidator.bind(this),
    this.timeOverlapValidator.bind(this),
  ]);
  timeEndFormControl = new FormControl('', [
    Validators.required,
    this.timeEndValidator.bind(this),
    this.timeOverlapValidator.bind(this),
  ]);
  classroomFormControl = new FormControl('', [Validators.required]);

  onTimeStartChange(newValue: string) {
    this.selectedTimeStart = newValue;
    this.timeEndFormControl.updateValueAndValidity();
    this.timeStartFormControl.updateValueAndValidity();
  }

  onTimeEndChange(newValue: string) {
    this.selectedTimeEnd = newValue;
    this.timeStartFormControl.updateValueAndValidity();
    this.timeEndFormControl.updateValueAndValidity();
  }

  getAppointmentsForExam(): Appointment[] {
    return this.myAppointments.filter((appointment) => appointment.examId === this.id);
  }

  getStatusTranslation(status: string): string {
    return this.statusTranslationService.getStatusTranslation(status);
  }

  getAppointmentMatches(appointmentId: number): string[] {
    if (!this.appointmentsMatches) {
      return [];
    }

    const matches = this.appointmentsMatches.find((match) => match.id === appointmentId);
    if (!matches) {
      return [];
    }

    const results = [];
    if (matches.matches.includes('professor')) {
      results.push('Profesorul are examen/colocviu');
    }
    if (matches.matches.includes('classroom')) {
      results.push('Sala este ocupata');
    }
    if (matches.matches.includes('group')) {
      results.push('Grupa are examen/colocviu');
    }

    return results;
  }

  cancelAppointment(appointmentId: number): void {
    const appointmentToCancel = this.myAppointments.find((appointment) => appointment.appointmentId === appointmentId);

    if (!appointmentToCancel) {
      console.error('Appointment not found.');
      return;
    }

    if (confirm('Sigur doriti sa anulati aceasta programare?')) {
      const updatedAppointment = new Appointment(
        appointmentToCancel.appointmentId,
        appointmentToCancel.examId,
        appointmentToCancel.groupId,
        'canceled',
        appointmentToCancel.startTime,
        appointmentToCancel.endTime,
        appointmentToCancel.classroomId
      );

      this.appointmentService.updateAppointment(appointmentId, updatedAppointment).subscribe({
        next: () => {
          this.loadMyAppointments();
          console.log('Appointment cancelled successfully.');
        },
        error: (err) => {
          console.error('Error updating appointment:', err);
        },
      });
    }
  }

  showPopup(message: string): void {
    this.dialog.open(PopupDialogComponent, {
      data: { message },
    });
  }

  goBack(): void {
    this.router.navigate(['student/exams']);
  }

  submit(): void {
    const appointments = this.getAppointmentsForExam();
    const scheduledAppointments = appointments.filter((appointment) => appointment.status === 'scheduled');
    const pendingAppointments = appointments.filter((appointment) => appointment.status === 'pending');

    if (scheduledAppointments && scheduledAppointments.length > 0) {
      this.showPopup('Aveti deja o programare confirmata pentru acest examen.');
      return;
    }
    if (pendingAppointments && pendingAppointments.length > 0) {
      this.showPopup('Aveti deja o programare in asteptare pentru acest examen.');
      return;
    }

    // Ensure all form controls are valid
    if (
      this.dateFormControl.invalid ||
      this.timeStartFormControl.invalid ||
      this.timeEndFormControl.invalid ||
      this.classroomFormControl.invalid
    ) {
      return;
    }

    // Construct the new appointment data
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')!;
    const startTime = new Date(`${formattedDate}T${this.selectedTimeStart}:00`);
    const endTime = new Date(`${formattedDate}T${this.selectedTimeEnd}:00`);

    const user_id = Number(localStorage.getItem('user_id'));

    this.studentService.getStudentById(user_id).subscribe({
      next: (data: Student) => {
        const groupId = data.groupId;

        const newAppointment = new Appointment(
          0, // Backend will generate the appointmentId
          this.id!,
          groupId,
          'pending',
          startTime,
          endTime,
          this.classroomId!
        );

        this.appointmentService.createAppointment(newAppointment).subscribe({
          next: (data: Appointment) => {
            console.log('Programare creata cu succes:', data);
            this.router.navigate(['student/exams']);
          },
          error: (err) => {
            this.showPopup(err.error.message);
            console.error('Eroare la crearea programarii:', err);
          },
        });
      },
      error: (err) => {
        console.error('Eroare la preluarea studentului:', err);
      },
    });
  }
}
