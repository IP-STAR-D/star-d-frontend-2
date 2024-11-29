import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Classroom {
  classroomId: number;
  classroomName: string;
  capacity: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private apiUrl = `${environment.apiUrl}/classrooms`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Get all classrooms
  getClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Get a classroom by ID
  getClassroomById(classroomId: number): Observable<Classroom> {
    const url = `${this.apiUrl}/${classroomId}`;
    return this.http.get<Classroom>(url, { headers: this.getAuthHeaders() });
  }

  // Create a new classroom
  createClassroom(classroom: Classroom): Observable<Classroom> {
    return this.http.post<Classroom>(this.apiUrl, classroom, { headers: this.getAuthHeaders() });
  }

  // Update an existing classroom
  updateClassroom(classroomId: number, classroom: Classroom): Observable<Classroom> {
    const url = `${this.apiUrl}/${classroomId}`;
    return this.http.put<Classroom>(url, classroom, { headers: this.getAuthHeaders() });
  }

  // Delete a classroom
  deleteClassroom(classroomId: number): Observable<void> {
    const url = `${this.apiUrl}/${classroomId}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
