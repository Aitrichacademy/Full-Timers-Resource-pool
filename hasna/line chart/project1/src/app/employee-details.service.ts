import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailsService {

  constructor(private http:HttpClient) {
  
   }
     getEmployeeDetails():Observable<any>{
     return this.http.get("http://localhost:3000/employees")
    }
    getEmployeeStatus():Observable<any>{
      return this.http.get("http://localhost:3000/statsData")
    }
    getChartName():Observable<any>{
      return this.http.get("http://localhost:3000/chartName")
    }
    getLineChart():Observable<any>{
      return this.http.get("http://localhost:3000/line-chart")
    }
    getLineChartTarget():Observable<any>{
      return this.http.get("http://localhost:3000/target")
    }
}
