import { Component} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {


 private themes = ['blue-theme','dark-theme', 'light-theme' ];
  private currentThemeIndex = 0;

 constructor() {
   
    document.body.classList.add(this.themes[this.currentThemeIndex]);
  }

  toggleTheme() {

    const currentTheme = this.themes[this.currentThemeIndex];
    
     document.body.classList.remove(this.themes[this.currentThemeIndex]);

   
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    const nextTheme = this.themes[this.currentThemeIndex];


     document.body.classList.add(nextTheme );
  }
}
