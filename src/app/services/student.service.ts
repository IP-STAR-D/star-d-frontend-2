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

  // Retrieve students by degree ID
  getStudentsByDegreeId(degreeId: number): Observable<Student[]> {
    const url = `${this.apiUrl}/degree/${degreeId}`;
    return this.http.get<Student[]>(url, { headers: this.getAuthHeaders() });
  }

  // Add a new student
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student, { headers: this.getAuthHeaders() });
  }

  // Update an existing student
  updateStudent(id: number, student: Student): Observable<Student> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Student>(url, student, { headers: this.getAuthHeaders() });
  }

  // Delete a student
  deleteStudent(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
