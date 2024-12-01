import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './popup-dialog.component.html',
  styleUrl: './popup-dialog.component.css',
})
export class PopupDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
