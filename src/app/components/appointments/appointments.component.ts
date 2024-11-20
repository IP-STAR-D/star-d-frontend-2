import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog'
import { Appointment } from '../../models/appointment.model';
import { User } from '../../models/user.model';
import { usersData } from '../../data/user.data';
import { Exam } from '../../models/exam.model';
import { examsData } from '../../data/exam.data';
import { appointmentsData } from '../../data/appointment.data';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AppointmentModal } from '../modal/modal.component';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, FooterComponent, HeaderComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class AppointmentsComponent {
  appointments: Appointment[] = appointmentsData;
  users: User[] = usersData;
  exams: Exam[] = examsData;

  constructor(private router: Router, private dialog: MatDialog) {}

  openDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentModal, {
      data: { appointment, exam: this.getExam(appointment.examId) }, 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        //Change appointment status
      }
    });
  }

  getExam(examId: number): Exam | null {
    const exam = this.exams.find((exam) => exam.examId === examId);
    return exam ? exam : null;
  }

}
