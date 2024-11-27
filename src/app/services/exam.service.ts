import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {

  private apiUrl = 'http://localhost:8080/exams'; // URL-ul API-ului backend

  constructor(private http: HttpClient) {}

  getExams(): Observable<any> {
    return this.http.get(this.apiUrl); // Trimiterea cererii GET la server
  }
}