import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = 'http://localhost:8080/users'; // URL-ul API-ului backend

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl); // Trimiterea cererii GET la server
  }

  getProfessorById(professorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${professorId}`);
  }
}