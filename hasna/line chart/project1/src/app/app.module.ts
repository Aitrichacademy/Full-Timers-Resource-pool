import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TableComponent } from './table/table.component';
import { TopbarComponent } from './topbar/topbar.component';
import { HttpClientModule } from '@angular/common/http';
import { lineRadial } from 'd3';
import { LineChartComponent } from './line-chart/line-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TableComponent,
    TopbarComponent,
  LineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
