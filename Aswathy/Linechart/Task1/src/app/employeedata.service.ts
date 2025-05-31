import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from './EmployeeModel';




@Injectable({
  providedIn: 'root'
})
export class EmployeedataService {

  constructor(private http : HttpClient) { }

 baseURL = 'http://localhost:3000/employeeData'; 

 getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseURL);
  }
}
