import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Appointment, FilteredAppointmentsResponse } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    return headers;
  }

  // Retrieve all appointments
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Retrieve appointments filtered by professorId, classroomId, day
  getAppointmentsByFilters(filters: {
    professorId?: number;
    classroomId?: number;
    day?: string;
  }): Observable<FilteredAppointmentsResponse> {
    const params: any = {};

    if (filters.professorId) {
      params.professorId = filters.professorId;
    }
    if (filters.classroomId) {
      params.classroomId = filters.classroomId;
    }
    if (filters.day) {
      params.day = filters.day; // Ensure `day` is a valid string in 'YYYY-MM-DD' format
    }

    const url = `${this.apiUrl}/filter`;
    return this.http.get<FilteredAppointmentsResponse>(url, { headers: this.getAuthHeaders(), params });
  }

  // Retrieve a single appointment by ID
  getAppointmentById(id: number): Observable<Appointment> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Appointment>(url, { headers: this.getAuthHeaders() });
  }

  // Create a new appointment
  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment, { headers: this.getAuthHeaders() });
  }

  // Update an appointment by ID
  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Appointment>(url, appointment, { headers: this.getAuthHeaders() });
  }

  // Retrieve all appointments by exam ID
  getAppointmentsByExamId(examId: number): Observable<Appointment[]> {
    const url = `${this.apiUrl}/Exam/${examId}`;
    return this.http.get<Appointment[]>(url, { headers: this.getAuthHeaders() });
  }

  // Retrieve all appointments by group ID
  getAppointmentsByGroupId(groupId: number): Observable<Appointment[]> {
    const url = `${this.apiUrl}/group/${groupId}`;
    return this.http.get<Appointment[]>(url, { headers: this.getAuthHeaders() });
  }
}
