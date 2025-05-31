
import { Component, OnInit } from '@angular/core';
import { Employee } from '../EmployeeModel';
import { EmployeedataService } from '../employeedata.service';
import { Subscription, switchMap, timer } from 'rxjs';


@Component({
  selector: 'app-employeetable',
  templateUrl: './employeetable.component.html',
  styleUrls: ['./employeetable.component.css']
})
export class EmployeetableComponent implements OnInit{


  currentIndices = [0, 15, 30];
  employees: Employee[] = [];
  private dataPollingSub!: Subscription;
  private rotationSub!: Subscription;
  constructor(private employeeService: EmployeedataService) {}


ngOnInit() {
    
    this.dataPollingSub = timer(0, 5000).pipe(
      switchMap(() => this.employeeService.getEmployees())
    ).subscribe(data => {
      this.employees = data;

     
      if (this.currentIndices.some(index => index >= data.length)) {
        this.currentIndices = [0, 15, 30];
      }

      
      if (!this.rotationSub && data.length > 45) {
        this.startRotation();
      }
    });
  }

  startRotation() {
    this.rotationSub = timer(3000, 3000).subscribe(() => {
      this.rotateTables();
    });
  }



  // ngOnInit() {
  
  //   this.employeeService.getEmployees().subscribe(data => {
  //     this.employees = data;

  
  //     if (this.employees.length > 45) {
  //       timer(3000, 3000).subscribe(() => {
  //         this.rotateTables();
  //       });
  //     }
  //   });
  // }


  rotateTables() {
    const total = this.employees.length;
    let [t1, t2, t3] = this.currentIndices;

    let nextStart = t3 + 15;
    if (nextStart >= total) {
      nextStart = 0; 
    }

    
    this.currentIndices = [t2, t3, nextStart];
  }

  
  getTableData(tableIndex: number): (Employee | null)[] {

    const startIdx = this.currentIndices[tableIndex];
    const total = this.employees.length;
    const result: (Employee | null)[] = [];

    for (let i = 0; i < 15; i++) {
      const idx = startIdx + i;
      if (idx < total) {
        result.push(this.employees[idx]);
      } else {
        result.push(null);
      }
    }

    return result;
  }










  











 



















  
  
  
  
  isZeroEp(ep: string): boolean {
    return ep.replace(/\s/g, '') === '0%';
  }




}
