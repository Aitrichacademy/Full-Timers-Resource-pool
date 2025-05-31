import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Metric {
  label: string;
  value: number;
  unit: string;
  color: string;
  chartType: 'text' | 'progress' | 'gauge';
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  constructor(private http : HttpClient) { }

  
 baseURL = 'http://localhost:3001/metrics'; 
 getMetrics(): Observable<Metric[]> {
    return this.http.get<Metric[]>(this.baseURL);
  }
}
