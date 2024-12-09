import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root', // Makes the service globally available
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a snack bar message.
   * @param message The message to display.
   * @param action The action button label (optional, default is 'Inchide').
   * @param duration The duration in milliseconds (optional, default is 10000ms).
   */
  show(message: string, duration: number = 10000, action: string = 'Inchide'): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
