import { Component,ViewChild } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project1';

  currentTheme = 'theme-default';

  setTheme(theme: string) {
    this.currentTheme = theme;
  }

 
 constructor(){
 }


  ngOnInit() {
   
  }
 
}


