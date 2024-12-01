import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatusTranslationService {
  private statusTranslation: { [key: string]: string } = {
    scheduled: 'Programat',
    pending: 'In asteptare',
    rejected: 'Respins',
  };

  constructor() {}

  getStatusTranslation(status: string): string {
    return this.statusTranslation[status];
  }
}
