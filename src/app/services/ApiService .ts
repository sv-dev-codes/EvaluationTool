import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  post<T>(body: any): Observable<T> {
    let url = this.baseUrl + "qa/analyze";
    return this.http.post<T>(url, body);
  }
}