import { Component, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-metric-chart',
  templateUrl: './metric-chart.component.html',
  styleUrls: ['./metric-chart.component.css']
})
export class MetricChartComponent {
@Input() label!: string;
  @Input() value!: number;
  @Input() unit: string = '';
  @Input() color: string = '#ffffff'; 
 @Input() chartType: 'text' | 'gauge' | 'progress' = 'text';
 startAngle: number | undefined;
  endAngle: number | undefined;
innerRadius!: number;
  outerRadius!: number;
  constructor(private el: ElementRef) {}

  // ngOnInit(): void {
  //   this.renderTextChart();
  // }


  ngOnInit(): void {
  switch (this.chartType) {
    case 'text':
      this.renderTextChart();
      break;
    case 'progress':
      this.renderProgressChart();
      break;
    case 'gauge':
      this.renderGaugeChart();
      break;
    default:
      this.renderTextChart();
  }
}

  renderTextChart(): void {
    const container = d3.select(this.el.nativeElement.querySelector('.chart'));
    const width = 200, height = 100;

    container.selectAll('*').remove(); 

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height);


      

svg.append('text')
  .attr('x', width / 2)
  .attr('y', 30) 
  .attr('text-anchor', 'middle')
  .attr('fill', 'var( --text-color)')
 
  .style('font-size', '14px')
  .text(this.label);

svg.append('text')
  .attr('x', width / 2)
  .attr('y', height / 2 + 20) 
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'middle')
  .attr('fill', this.color)
  .style('font-size', '36px')
  .style('font-weight', 'bold')
  .text(`${this.value}${this.unit}`);

    
  }

renderProgressChart(): void {
  const containerEl = this.el.nativeElement.querySelector('.chart');
  const container = d3.select(containerEl);

  const width = 210;
  const height = 100;
  const barHeight = 40;

  container.selectAll('*').remove();

  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  svg.append('text')
    .attr('x', width / 2.4)
    .attr('y', 20) 
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .attr('fill', 'var(--text-color)')
    .text(this.label);

  const barY = 40;

  svg.append('rect')
    .attr('x', 0)
    .attr('y', barY)
    .attr('width', width)
    .attr('height', barHeight)
    .attr('fill', '#eee');


  svg.append('rect')
    .attr('x', 0)
    .attr('y', barY)
    .attr('width', (this.value / 100) * width)
    .attr('height', barHeight)
    .attr('fill', this.color);


  svg.append('text')
    .attr('x', width / 2)
    .attr('y', barY + barHeight / 2.4)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .attr('fill', 'var(--text-color)')
    .text(`${this.value}${this.unit}`);
}





renderGaugeChart(): void {
  const container = d3.select(this.el.nativeElement.querySelector('.chart'));
  const width = 200;
  const height = 100; 
  const radius = 50;

  container.selectAll('*').remove();

  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    
    .attr('transform', `translate(${width / 2}, ${height - 10})`);

  const arcGenerator = d3.arc();

  

  const arcDataBackground = {
    startAngle: Math.PI,
    endAngle: -Math.PI,
    innerRadius: radius - 10,
    outerRadius: radius,
  };
const maxValue = 100;
const clampedValue = Math.min(Math.max(this.value, 0), maxValue);
const percent = clampedValue / maxValue;
  const arcDataValue = {
    startAngle: -Math.PI,
    endAngle: (-Math.PI/2) + Math.PI * percent, 
    innerRadius: radius - 10,
    outerRadius: radius,
  };

  svg.append('path')
    .attr('d', arcGenerator(arcDataBackground)!)
    .attr('fill', '#eee');

  svg.append('path')
    .attr('d', arcGenerator(arcDataValue)!)
    .attr('fill', this.color);

 
  const textGroup = svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', -radius - 25)
    .style('font-weight', 'bold');

  textGroup.append('tspan')
    .attr('x', 0)
    .attr('dy', '0')
    .style('font-size', '12px')
    .attr('fill', 'var(--text-color)')
    .text(this.label);

  textGroup.append('tspan')
    .attr('x', 0)
    .attr('dy', '1.4em')
    .style('font-size', '16px')
    .attr('fill', this.color)
    .text(`${this.value}${this.unit}`);
}

}




    
