import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    return headers;
  }

  // Get all groups
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Get a group by ID
  getGroupById(groupId: number): Observable<Group> {
    const url = `${this.apiUrl}/${groupId}`;
    return this.http.get<Group>(url, { headers: this.getAuthHeaders() });
  }
  // Retrieve groups by professor ID
  getGroupsByProfessorId(professorId: number): Observable<Group[]> {
    const url = `${this.apiUrl}/professor/${professorId}`;
    return this.http.get<Group[]>(url, { headers: this.getAuthHeaders() });
  }

  // Create a new group
  createGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group, { headers: this.getAuthHeaders() });
  }

  // Update an existing group
  updateGroup(groupId: number, group: Group): Observable<Group> {
    const url = `${this.apiUrl}/${groupId}`;
    return this.http.put<Group>(url, group, { headers: this.getAuthHeaders() });
  }

  // Delete a group
  deleteGroup(groupId: number): Observable<void> {
    const url = `${this.apiUrl}/${groupId}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() });
  }
}
