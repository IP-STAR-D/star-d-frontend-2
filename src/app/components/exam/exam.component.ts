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

import { Appointment } from '../../models/appointment.model';
import { Exam } from '../../models/exam.model';
import { Classroom } from '../../models/classroom.model';
import { Student } from '../../models/student.model';

import { AppointmentsService } from '../../services/appointment.service';
import { ExamService } from '../../services/exam.service';
import { ClassroomService } from '../../services/classroom.service';
import { StudentService } from '../../services/student.service';

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
  ],
  host: { '[style.--sys-inverse-surface]': 'red' },
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent {
  id: number | null = null;
  exam: Exam | null = null;
  appointments: Appointment[] = [];
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
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExam();
    this.loadClassrooms();
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
    if (!this.selectedDate || !this.exam || !this.classroomId) {
      return;
    }

    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')?.toString();

    this.appointmentService
      .getAppointmentsByFilters({
        professorId: this.exam.professorId,
        classroomId: this.classroomId,
        day: formattedDate,
      })
      .subscribe({
        next: (data: Appointment[]) => {
          this.appointments = data.filter((appointment) => appointment.status === 'scheduled');
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

  submit(): void {
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

    this.studentService.getStudentById(this.id!).subscribe({
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
