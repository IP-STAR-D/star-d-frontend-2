import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Degree } from "../models/degree.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class DegreeService {
    private apiUrl = `${environment.apiUrl}/degrees`;
    
      private getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
    
        if (token) {
          headers = headers.set('Authorization', token);
        }
    
        return headers;
      }
    
      constructor(private http: HttpClient) {}

      getDegrees(): Observable<Degree[]> {
        const url = `${this.apiUrl}`;
        return this.http.get<Degree[]>(url, { headers: this.getAuthHeaders() });
      }
}