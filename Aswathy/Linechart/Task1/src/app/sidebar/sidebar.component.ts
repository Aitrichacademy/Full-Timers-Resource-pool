import { Component, HostListener, OnInit } from '@angular/core';
import { Metric, MetricsService } from '../metrics.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  metrics: Metric[] = [];
  constructor(private metricsService: MetricsService) {}
 isSidebarVisible = false;

  ngOnInit(): void {
    this.updateSidebarVisibility();
    this.metricsService.getMetrics().subscribe({
      next: (data) => this.metrics = data,
      error: (err) => console.error('Error loading metrics:', err)
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.updateSidebarVisibility();
  }

  updateSidebarVisibility() {
    this.isSidebarVisible = window.innerWidth <= 768;
  }



  // metrics = [
  //   { label: 'Total Employees', value: 126, unit: '', color: 'var( --text-color)', chartType: 'text' as const },
  //   { label: 'Not Clockedin', value: 68, unit: '', color: '#b366ff',chartType: 'progress' as const },
  //   { label: 'UPH', value: 500, unit: '', color: '#00ff00',chartType: 'progress' as const},
  //   { label: 'Employee Performance', value: 88.02, unit: '%', color: '#00ffbf',chartType: 'progress' as const },
  //   { label: 'Employee Utilization', value: 50.09, unit: '%', color: '#00ffbf',chartType: 'gauge' as const }
  // ];
}
