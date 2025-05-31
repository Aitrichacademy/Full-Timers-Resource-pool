import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { EmployeeDetailsService } from '../employee-details.service';
@Component({
  
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']

})

export class SidebarComponent {

  name: any
  statsData = [
    {
      label: 'total employees:', value: '126', color: '#ffffff', fontSize: '48px', x: 20,
      y: 110,chartName:'text-chart'
    },

  ];

  constructor(private el: ElementRef, private employeeService: EmployeeDetailsService) { }

  ngOnInit(): void {
    this.statsData = []
    this.employeeService.getEmployeeStatus().subscribe((data) => {
      this.statsData = data
      
        for(const elem of this.statsData){
          if(elem.chartName=='text-chart'){
            this.statsData=[elem]
            this.createTextChart()
          }
          else if(elem.chartName=='progress-chart'){
            this.statsData=[elem]
            this.createProgressChart()
          }
          else{
            this.statsData=[elem]
            this.createGuageChart() 
          }
        }
      
      
      

      

    
    })

    // this.createProgressChart();
    // this.createGuageChart()
  }

  private createTextChart(): void {
    const element = this.el.nativeElement;
    const svg = d3.select(element)
      .select('.chart-container')
      .append('div').attr('class','col d-md-inline-block d-flex justify-content-center') .attr('width', 115)
      .append('svg')
      
      .attr('width', 115)
      .attr('height', 125);


    const cardHeight = 115;
    const padding = 12;

    const groups = svg.selectAll('g')
      .data(this.statsData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * (cardHeight + padding)})`);

    groups.append('rect')
      .attr('width', 117)
      .attr('height', cardHeight)
      .attr('fill','var(--sidebar-bg)')
      .attr('rx', 8)
      .attr('ry', 8)
        ;

    const labelText = groups.append('text')
      .attr('x', 20)
      .attr('y', 25)
      .attr('fill', 'var(--text-color)')
      .attr('font-size', '16px');

    labelText.each(function (d) {
      const words = d.label.split(' ');
      const textEl = d3.select(this);
      words.forEach((word, i) => {
        textEl.append('tspan')
          .text(word)
          .attr('x', 20)
          .attr('dy', i === 0 ? 0 : 21);  // Adjust spacing between lines
      });
    });

    groups.append('text')
      .text(d => d.value)
      .attr('x', 20)
      .attr('y', d => d.y)
      .attr('fill', d => d.color)
      .attr('font-size', d => d.fontSize)
      .attr('font-weight', 'bold');
  }


  private createProgressChart(): void {
    const element = this.el.nativeElement;
    const svg = d3.select(element)
      .select('.chart-container')
      .append('div').attr('class','col d-md-inline-block d-flex justify-content-center') .attr('width', 115)
      .append('svg')
      .attr('width', 115)
      .attr('height', 125);

    const cardHeight = 115;
    const padding = 12;

    const groups = svg.selectAll('g')
      .data(this.statsData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * (cardHeight + padding)})`);

    groups.append('rect')
      .attr('width', 116)
      .attr('height', cardHeight)
      .attr('fill','var(--sidebar-bg)')
      .attr('rx', 8)
      .attr('ry', 8);

    const labelText = groups.append('text')
      .attr('x', 20)
      .attr('y', 25)
      .attr('fill', 'var(--text-color)')
      .attr('font-size', '16px');

    labelText.each(function (d) {
      const words = d.label.split(' ');
      const textEl = d3.select(this);
      words.forEach((word, i) => {
        textEl.append('tspan')
          .text(word)
          .attr('x', 20)
          .attr('dy', i === 0 ? 0 : 21);
      });
    });

    // Conditional rendering: Text or Progress Bar
    groups.each(function (d) {
      const group = d3.select(this);
      const isPercent = typeof d.value === 'string' && d.value.endsWith('%');

      if (isPercent) {
        const percent = parseFloat(d.value);
        const barWidth = 80; // Max width of progress bar

        // Background bar
        group.append('rect')
          .attr('x', d.x)
          .attr('y', d.y)
          .attr('width', barWidth)
          .attr('height', 8)
          .attr('fill', '#333');

        // Foreground (progress) bar
        group.append('rect')
          .attr('x', d.x)
          .attr('y', d.y)
          .attr('width', barWidth * (percent / 100))
          .attr('height', 8)
          .attr('fill', 'green');
          

        // Optional: Show % text next to bar
        group.append('text')
          .text(d.value)
          .attr('x', d.x + barWidth + 5)
          .attr('y', d.y + 7)
          .attr('fill', d.color)
          .attr('font-size', d.fontSize)
          .attr('font-weight', 'bold');
      } else {
        // Regular numeric value
        group.append('text')
          .text(d.value)
          .attr('x', d.x)
          .attr('y', d.y)
          .attr('fill', d.color)
          .attr('font-size', d.fontSize)
          .attr('font-weight', 'bold');
      }
    });
  }

  private createGuageChart(): void {
    const gaugeX = 0;
    const gaugeY = 29;


    
    const element = this.el.nativeElement;
    const svg = d3.select(element)
      .select('.chart-container')
       .append('div').attr('class','col d-md-inline-block d-flex justify-content-center') .attr('width', 115)
      .append('svg')
      .attr('width', 115)
      .attr('height', 115);

    const cardHeight = 115;
    const padding = 12;

    const arcGenerator = d3.arc()
      .innerRadius(20)
      .outerRadius(30)
      .startAngle(-Math.PI / 2); // start at bottom center (semi-circle)

    const groups = svg.selectAll('g')
      .data(this.statsData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(60, ${i * (cardHeight + padding) + 60})`);

    // Card background
    groups.append('rect')
      .attr('x', -60)
      .attr('y', -60)
      .attr('width', 120)
      .attr('height', cardHeight)
      .attr('fill','var(--sidebar-bg)')
      .attr('rx', 8)
      .attr('ry', 8);

    // Labels
    const labelText = groups.append('text')
      .attr('x', -40)
      .attr('y', -25)
      .attr('fill', 'var(--text-color)')
      .attr('font-size', '16px');

    labelText.each(function (d) {
      const words = d.label.split(' ');
      const textEl = d3.select(this);
      words.forEach((word, i) => {
        textEl.append('tspan')
          .text(word)
          .attr('x', -40)
          .attr('dy', i === 0 ? 0 : 18);
      });
    });

    // Value or gauge
    groups.each(function (d) {
      const group = d3.select(this);
      const isPercent = typeof d.value === 'string' && d.value.endsWith('%');

      if (isPercent) {
        const percent = parseFloat(d.value) / 100;

        // Background arc (full semicircle)
       const gaugeGroup = group.append('g')
  .attr('transform', `translate(${gaugeX}, ${gaugeY})`);

// Background arc (full semicircle)
gaugeGroup.append('path')
  .datum({ endAngle: Math.PI / 2 })
  .attr('d', arcGenerator as any)
  .attr('fill', '#333');

// Foreground arc
gaugeGroup.append('path')
  .datum({ endAngle: (-Math.PI / 2) + Math.PI * percent })
  .attr('d', arcGenerator as any)
  .attr('fill', d.color);

// % Text in center of gauge
gaugeGroup.append('text')
  .text(d.value)
  .attr('text-anchor', 'middle')
  .attr('dy', '1em')
  .attr('font-size', d.fontSize)
  .attr('fill', d.color)
  .attr('font-weight', 'bold');
      }
    });
  }

}