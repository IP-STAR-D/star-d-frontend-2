import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';

export interface DialogData {
  status: 'pending' | 'accepted' | 'refused';
}

@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'modal.component.html',
  styleUrl: 'modal.component.css',
  standalone: true,
  imports: [
    MatDialogTitle, 
    MatDialogContent,
    MatDialogActions,
    MatDialogClose],
})
export class AppointmentModal {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AppointmentModal>);
  appointment = this.data.appointment;
  exam = this.data.exam;
  onAccept(): void {
    // Handle accept action
    // this.dialogRef.close({ status: 'accepted' });
  }

  onReject(): void {
    // Handle reject action
    // this.dialogRef.close({ status: 'rejected' });
  }
  
  getTime(date: Date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
