import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Exam } from '../models/exam.model';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exams`;

  constructor(private http: HttpClient) {}

  // Retrieve all exams
  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  // Retrieve a single exam by ID
  getExamById(id: number): Observable<Exam> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Exam>(url);
  }

  // Retrieve exams by professor ID
  getExamsByProfessorId(professorId: number): Observable<Exam[]> {
    const url = `${this.apiUrl}/professor/${professorId}`;
    return this.http.get<Exam[]>(url);
  }

  // Retrieve exams by degree ID
  getExamsByDegreeId(degreeId: number): Observable<Exam[]> {
    const url = `${this.apiUrl}/degree/${degreeId}`;
    return this.http.get<Exam[]>(url);
  }
}