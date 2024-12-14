import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatusTranslationService {
  private statusTranslation: { [key: string]: string } = {
    scheduled: 'Programat',
    pending: 'In asteptare',
    rejected: 'Respins',
    canceled: 'Anulat',
  };

  private typeTranslation: { [key: string]: string } = {
    exam: 'Examen',
    colloquy: 'Colocviu',
  };

  constructor() {}

  getStatusTranslation(status: string): string {
    return this.statusTranslation[status];
  }

  getTypeTranslation(type: string): string {
    return this.typeTranslation[type];
  }
}
