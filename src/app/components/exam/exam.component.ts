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
import { Semester } from '../../models/semester.model';

import { AppointmentsService } from '../../services/appointment.service';
import { ExamService } from '../../services/exam.service';
import { ClassroomService } from '../../services/classroom.service';
import { StudentService } from '../../services/student.service';
import { StatusTranslationService } from '../../services/translation.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { AuthService } from '../../services/auth.service';
import { SemesterService } from '../../services/semester.service';

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
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.css',
})
export class ExamComponent {
  id: number | null = null;
  exam: Exam | null = null;
  semester: Semester | null = null;
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

  minDate: Date = new Date();
  maxDate: Date = new Date();

  formDisabled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private appointmentService: AppointmentsService,
    private classroomService: ClassroomService,
    private studentService: StudentService,
    private semesterService: SemesterService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private statusTranslationService: StatusTranslationService,
    private snackBarService: SnackBarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExam();
    this.loadClassrooms();
    this.loadMyAppointments();
    this.loadSemester();
  }

  loadExam(): void {
    if (!this.id) return;

    this.examService.getExamById(this.id).subscribe({
      next: (data: Exam) => {
        this.exam = data;
        this.trySetDates();
      },
      error: (err) => {
        console.error('Eroare la preluarea examenului:', err);
        this.snackBarService.show('Eroare la preluarea examenului!', 'error');
      },
    });
  }

  loadSemester(): void {
    this.semesterService.getCurrentSemester().subscribe({
      next: (data: Semester) => {
        this.semester = data;
        this.trySetDates();
      },
      error: (err) => {
        console.error('Eroare la preluarea semestrului:', err);
        this.snackBarService.show('Eroare la preluarea semestrului!', 'error');
      },
    });
  }

  trySetDates(): void {
    if (this.exam && this.semester) {
      if (this.exam.type === 'exam') {
        this.minDate = new Date(this.semester.examStart);
        this.maxDate = new Date(this.semester.examEnd);
      } else if (this.exam.type === 'colloquy') {
        this.minDate = new Date(this.semester.colloquyStart);
        this.maxDate = new Date(this.semester.colloquyEnd);
      }
    }
  }

  loadClassrooms(): void {
    this.classroomService.getClassrooms().subscribe({
      next: (data: Classroom[]) => {
        this.classrooms = data.sort((a, b) => a.classroomName.localeCompare(b.classroomName));
      },
      error: (err) => {
        console.error('Eroare la preluarea salilor:', err);
        this.snackBarService.show('Eroare la preluarea salilor!', 'error');
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

          this.timeStartFormControl.updateValueAndValidity();
          this.timeEndFormControl.updateValueAndValidity();
        },
        error: (err) => {
          if (err.status === 404) {
            this.appointments = [];
            this.appointmentsMatches = [];
          } else {
            console.error('Eroare la preluarea programarilor:', err);
            this.snackBarService.show('Eroare la preluarea programarilor!', 'error');
          }
        },
      });
  }

  loadMyAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (data: Appointment[]) => {
        this.myAppointments = data;

        this.myAppointments.sort((a, b) => {
          const statusOrder = ['scheduled', 'pending', 'rejected', 'canceled'];
          const statusComparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
          if (statusComparison !== 0) {
            return statusComparison;
          }
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        });

        const activeAppointment = this.myAppointments.find(
          (appointment) =>
            (appointment.status === 'pending' || appointment.status === 'scheduled') && appointment.examId === this.id
        );

        if (activeAppointment) {
          this.setFormDisabledState(true);

          const startTime = new Date(activeAppointment.startTime);
          const endTime = new Date(activeAppointment.endTime);

          this.selectedDate = startTime.toLocaleDateString('en-CA');
          this.selectedTimeStart = startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          this.selectedTimeEnd = endTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          this.classroomId = activeAppointment.classroomId;
        }
      },
      error: (err) => {
        this.snackBarService.show('Eroare la preluarea programarilor!', 'error');
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

  onDateChange(newValue: string) {
    this.selectedDate = newValue;
    this.timeStartFormControl.updateValueAndValidity();
    this.timeEndFormControl.updateValueAndValidity();
  }

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

  onClassroomChange(newValue: number) {
    this.classroomId = newValue;
    this.timeStartFormControl.updateValueAndValidity();
    this.timeEndFormControl.updateValueAndValidity();
  }

  setFormDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.formDisabled = true;
      this.dateFormControl.disable();
      this.timeStartFormControl.disable();
      this.timeEndFormControl.disable();
      this.classroomFormControl.disable();
    } else {
      this.formDisabled = false;
      this.dateFormControl.enable();
      this.timeStartFormControl.enable();
      this.timeEndFormControl.enable();
      this.classroomFormControl.enable();
    }
  }

  getAppointmentsForExam(): Appointment[] {
    return this.myAppointments.filter((appointment) => appointment.examId === this.id);
  }

  getClassroomName(classroomId: number): string {
    const classroom = this.classrooms.find((classroom) => classroom.classroomId === classroomId);
    return classroom ? classroom.classroomName : '';
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
      this.snackBarService.show('Eroare: Programarea nu a fost gasita.', 'error');
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
          this.snackBarService.show('Programarea a fost anulata.', 'success');
        },
        error: (err) => {
          this.snackBarService.show('Eroare la anularea programarii.', 'error');
        },
      });

      this.setFormDisabledState(false);

      this.selectedDate = null;
      this.selectedTimeStart = null;
      this.selectedTimeEnd = null;
      this.classroomId = null;
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
      this.snackBarService.show('Aveti deja o programare confirmata pentru acest examen.', 'error');
      return;
    }
    if (pendingAppointments && pendingAppointments.length > 0) {
      this.showPopup('Aveti deja o programare in asteptare pentru acest examen.');
      this.snackBarService.show('Aveti deja o programare in asteptare pentru acest examen!', 'error');
      return;
    }

    // Ensure all form controls are valid
    if (
      this.dateFormControl.invalid ||
      this.timeStartFormControl.invalid ||
      this.timeEndFormControl.invalid ||
      this.classroomFormControl.invalid
    ) {
      this.snackBarService.show('Verificati campurile si incercati din nou.', 'error');
      return;
    }

    // Construct the new appointment data
    const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')!;
    const startTime = new Date(`${formattedDate}T${this.selectedTimeStart}:00`);
    const endTime = new Date(`${formattedDate}T${this.selectedTimeEnd}:00`);

    const user_id = Number(this.authService.getUserId());

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
            this.snackBarService.show('Programarea a fost creata.', 'success');
            this.router.navigate(['student/exams']);
          },
          error: (err) => {
            this.showPopup(err.error.message);
            this.snackBarService.show('Eroare la crearea programarii!', 'error');
          },
        });
      },
      error: (err) => {
        this.snackBarService.show('Eroare la preluarea datelor studentului.', 'error');
      },
    });
  }
}
