import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:5000/api/doctors';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addDoctor(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateDoctor(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteDoctor(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
