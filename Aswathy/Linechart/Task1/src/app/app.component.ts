import { Component, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'Task1';



chartData = [
  { time: '04:30', value: 200 },
  { time: '05:30', value: 5000 }
];

target = 5000;

}
