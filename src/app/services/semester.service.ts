import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Semester } from '../models/semester.model';

@Injectable({
  providedIn: 'root',
})
export class SemesterService {
  private apiUrl = `${environment.apiUrl}/semesters`;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    return headers;
  }

  constructor(private http: HttpClient) {}

  // Create a new Semester
  createSemester(semester: Semester): Observable<Semester> {
    return this.http.post<Semester>(this.apiUrl, semester, { headers: this.getAuthHeaders() });
  }

  // Retrieve all Semesters
  getSemesters(): Observable<Semester[]> {
    return this.http.get<Semester[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Retrieve the Current Semester
  getCurrentSemester(): Observable<Semester> {
    const url = `${this.apiUrl}/current`;
    return this.http.get<Semester>(url, { headers: this.getAuthHeaders() });
  }

  // Retrieve Semesters by Year and Semester
  findSemestersByYearAndSemester(year: number, semester: string): Observable<Semester[]> {
    const url = `${this.apiUrl}/search?year=${year}&semester=${semester}`;
    return this.http.get<Semester[]>(url, { headers: this.getAuthHeaders() });
  }

  // Retrieve a single Semester by ID
  getSemesterById(id: number): Observable<Semester> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Semester>(url, { headers: this.getAuthHeaders() });
  }

  // Update a Semester by ID
  updateSemester(id: number, semester: Semester): Observable<Semester> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Semester>(url, semester, { headers: this.getAuthHeaders() });
  }

  // Delete a Semester by ID
  deleteSemester(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
