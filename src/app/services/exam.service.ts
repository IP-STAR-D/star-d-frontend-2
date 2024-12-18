import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Exam } from '../models/exam.model';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exams`;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    return headers;
  }

  constructor(private http: HttpClient) {}

  // Retrieve all exams
  getExams(): Observable<Exam[]> {
    const url = `${this.apiUrl}/all`;
    return this.http.get<Exam[]>(url, { headers: this.getAuthHeaders() });
  }

  getPertinentExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Retrieve a single exam by ID
  getExamById(id: number): Observable<Exam> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Exam>(url, { headers: this.getAuthHeaders() });
  }

  // Retrieve exams by professor ID
  getExamsByProfessorId(professorId: number): Observable<Exam[]> {
    const url = `${this.apiUrl}/professor/${professorId}`;
    return this.http.get<Exam[]>(url, { headers: this.getAuthHeaders() });
  }

  // Retrieve exams by degree ID
  getExamsByDegreeId(degreeId: number): Observable<Exam[]> {
    const url = `${this.apiUrl}/degree/${degreeId}`;
    return this.http.get<Exam[]>(url, { headers: this.getAuthHeaders() });
  }
}
