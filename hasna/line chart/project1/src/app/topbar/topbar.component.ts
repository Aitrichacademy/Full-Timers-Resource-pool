import { Component,Output, EventEmitter, Input } from '@angular/core';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {

 @Output() themeChange = new EventEmitter<string>();

  themes = ['theme-default', 'theme-light', 'theme-blue'];
  currentIndex = 0;

  toggleTheme() {
    this.currentIndex = (this.currentIndex + 1) % this.themes.length;
    this.themeChange.emit(this.themes[this.currentIndex]);
  }

constructor(){}

  
 
}
