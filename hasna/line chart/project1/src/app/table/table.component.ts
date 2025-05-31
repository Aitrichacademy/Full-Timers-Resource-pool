import { Component, Input } from '@angular/core';
import { EmployeeDetailsService } from '../employee-details.service';
import { differenceWith, isEqual } from 'lodash';
import { Observable, Subscription, switchMap, interval } from 'rxjs';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  
  employees: any
  rotationCount = 1
  spliceEnd = 0
  employeeData: any
  private refreshSubscription!: Subscription;

  constructor(private employee: EmployeeDetailsService) { }
  ngOnInit(): void {
   
    this.employee.getEmployeeDetails().subscribe((data: any) => {
      this.employeeData=[...data]
      while (this.employeeData.length < 45) {
        this.employeeData.push({});
      }
      this.employees = [...data]
    })



    this.refreshSubscription = interval(5000)
      .pipe(
        switchMap(() => this.employee.getEmployeeDetails())
      )
      .subscribe(data => {
        
        const employeeData = [...data]
        while (employeeData.length < 45 ||(employeeData.length > 45&&employeeData.length %15!=0)) {
          employeeData.push({});
        }
        this.rotationCount = Math.round(employeeData.length / 15)
        if(employeeData.length > 45){
        this.employees = this.rotateLeft([...employeeData]);}
        else{
          this.employees=[...employeeData]
        }
        
      });


  }



  rotateLeft(arr: any[]): any[] {
    if (arr.length <= 15) return arr;
    
    const chunk = arr.splice(0, this.spliceEnd * 15);
    if (this.spliceEnd <  this.rotationCount) {

      this.spliceEnd = this.spliceEnd + 1;
    } else {
      this.spliceEnd = 0;
    }
    return arr.concat(chunk);

  }



  ngOnDestroy(): void {
   
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
 