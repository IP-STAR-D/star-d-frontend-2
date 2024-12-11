import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Professor } from '../models/professor.model';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private apiUrl = `${environment.apiUrl}/professors`;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    return headers;
  }

  constructor(private http: HttpClient) {}

  // Retrieve all professors
  getProfessors(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Retrieve a single Professor by ID
  getProfessorById(id: number): Observable<Professor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Professor>(url, { headers: this.getAuthHeaders() });
  }

  // Retrieve professors by group ID
  getProfessorsByGroupId(groupId: number): Observable<Professor[]> {
    const url = `${this.apiUrl}/group/${groupId}`;
    return this.http.get<Professor[]>(url, { headers: this.getAuthHeaders() });
  }

  // Retrieve professors by degree ID
  getProfessorsByDegreeId(degreeId: number): Observable<Professor[]> {
    const url = `${this.apiUrl}/degree/${degreeId}`;
    return this.http.get<Professor[]>(url, { headers: this.getAuthHeaders() });
  }

  // Add a new Professor
  addProfessor(Professor: Professor): Observable<Professor> {
    return this.http.post<Professor>(this.apiUrl, Professor, { headers: this.getAuthHeaders() });
  }

  // Update an existing Professor
  updateProfessor(id: number, Professor: Professor): Observable<Professor> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Professor>(url, Professor, { headers: this.getAuthHeaders() });
  }

  // Delete a Professor
  deleteProfessor(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
