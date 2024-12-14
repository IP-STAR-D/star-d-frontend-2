import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    return headers;
  }

  constructor(private http: HttpClient) {}

  // Retrieve all students
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Check if a student is the boss of their group
  isStudentBoss(): Observable<{ isBoss: boolean }> {
    const url = `${this.apiUrl}/is_boss`;
    return this.http.get<{ isBoss: boolean }>(url, { headers: this.getAuthHeaders() });
  }

  // Retrieve a single student by ID
  getStudentById(id: number): Observable<Student> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Student>(url, { headers: this.getAuthHeaders() });
  }

  // Retrieve students by group ID
  getStudentsByGroupId(groupId: number): Observable<Student[]> {
    const url = `${this.apiUrl}/group/${groupId}`;
    return this.http.get<Student[]>(url, { headers: this.getAuthHeaders() });
  }
}
