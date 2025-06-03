import { Component, ElementRef, HostListener, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { EmployeeDetailsService } from '../employee-details.service';
interface ThroughputData {
  time: string;
  value: number;
}
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.less']
})
export class LineChartComponent {
  @Input() data: any = [];
  // @Input() goal = 100;
  // @Input() currentValue = 1226;
  @Input() target:any;

  // goal=1000;
  private svg: any;
  private margin = { top: 100, right: 60, bottom: 50, left: 50 };
  private width = 0;
  private height = 0;
  private aspectRatio = 1.225; // 735/600 from original dimensions

  constructor(private elementRef: ElementRef,private employeeService:EmployeeDetailsService) {}

  @HostListener('window:resize')
  onResize() {
    this.updateChart();
  }

  ngOnInit(): void {
this.employeeService.getLineChart().subscribe((data)=>{
  this.data=data
  this.employeeService.getLineChartTarget().subscribe((data)=>{
this.target=data[0].target
 this.updateChart();
  })
})
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data !== undefined) {
      this.updateChart();
    }
  }
  convertToK(value: number): string {
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; 
    }
    return value.toString(); 
  }

  private updateChart(): void {
    const container = this.elementRef.nativeElement.querySelector('.chart-container');
    const width = window.innerWidth;
    const containerWidth = container.clientWidth;
    const isMobileS = width < 375; 
const isMobile = width < 768;


  
    this.width = containerWidth - this.margin.left - this.margin.right;
     this.height = Math.min(
      this.width * this.aspectRatio,
      window.innerHeight * 0.8
    );

    this.createSvg();
    this.drawChart();
  }
  
  formatToThousands(value: number): string {
   
    return `${(value/1000).toFixed(2)}K`;
  }

  private createSvg(): void {
    d3.select(this.elementRef.nativeElement.querySelector('.chart-container'))
      .select('svg')
      .remove();

   this.svg = d3.select(this.elementRef.nativeElement.querySelector('.chart-container'))
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right + 100} ${this.height + this.margin.top + this.margin.bottom + 60}`) // increased 40 → 60
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .append('g')
  .attr('transform', `translate(${this.margin.left},${this.margin.top - 50})`); 
  }

  private drawChart(): void {
    // Background
    this.svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', '#0a192f')
      ;

    // Scales
    // const x = d3.scalePoint()
    // .domain((this.data ?? []).map((d: any) => d.time))
    // .range([20, this.width + 50]);
    const x = d3.scalePoint()
  .domain((this.data?.length ? this.data : [
    { time: '00:00', value: 0 }
  ]).map((d: any) => d.time))
  .range([20, this.width + 50]);

    const values = (this.data ?? []).map((item: any) => item.value);
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
       const roundedMaxValue = Math.ceil(maxValue / 100) * 100;
       const extraPadding = 250
       const yLabel= roundedMaxValue>this.target ? roundedMaxValue : this.target ?? 0; 
      // const yLabel = roundedMaxValue > this.target ? roundedMaxValue + extraPadding : this.target + extraPadding;
   
    const y = d3.scaleLinear()
  .domain([0, yLabel])
  .range([this.height, this.margin.top]);

// const yTickValues = d3.range(0, yLabel + 1, 100);
    const yGridLines = d3.axisLeft(y)
      .tickSize(-this.width*1.2)
      .tickFormat(() => '')
      .ticks(10);

    this.svg.append('g')
      // .attr('class', 'grid')
      .call(yGridLines)
      .style('stroke', '#D9D9D9')
      .selectAll('line')
      .style('stroke', '#D9D9D9');

    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x))
      .style('color', '#D9D9D9')
      .style('font-size', '.69em')
      .selectAll('line')
      .style('stroke', '#D9D9D9');

    this.svg.append('g')
      .call(d3.axisLeft(y)
        .tickFormat((d: d3.NumberValue) => `${+d/1000}k`))
      .style('color', '#D9D9D9')
      .style('font-size','.85em')
      .selectAll('line')
      .style('stroke', 'transparent');


      if (
        this.data?.length > 1 || 
        (this.data?.length === 1 && this.data[0]?.value !== 0 && this.data[0]?.time !== '00:00')
      ) {
        const startTime = this.data[0]?.time ?? '00:00';
        const endTime = this.data[this.data.length - 1]?.time ?? '00:00';
      
        const targetData = [
          { time: startTime, value: 0 },
          { time: endTime, value: this.target ?? 0 }
        ];
      
        const targetLine = d3.line<ThroughputData>()
          .x(d => x(d.time) ?? 0)
          .y(d => y(d.value) ?? 0);
      
        this.svg.append('path')
          .datum(targetData)
          .attr('fill', 'none')
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '5,5')
          .attr('d', targetLine);
      } else {
        console.warn('Skipping target line: No valid data.');
      }
 
    const line = d3.line<ThroughputData>()
      .defined(d => d.value !== null)
      .x(d => x(d.time) ?? 0)
      .y(d => y(d.value) ?? 0);

    this.svg.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 4)
      .attr('d', line);


    this.svg.selectAll('.dot')
      .data(this.data.filter((d: any) => d.value !== null))
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d: ThroughputData) => x(d.time) ?? 0)
      .attr('cy', (d: ThroughputData) => y(d.value) ?? 0)
      .attr('r', 5)
      .attr('fill', 'white');

    const fontSize = Math.max(14, Math.min(26, this.width / 30)); 

  // X-axis Label
  this.svg.append('text')
    .attr('x', this.width / 2)
    .attr('y', this.height + 70) // Adjust offset as needed
    .attr('text-anchor', 'middle')
    .style('font-size', `${fontSize}px`)
    .style('fill', '#D9D9D9')
    .text('Shift Progress Hour');

  // Y-axis Label
  this.svg.append('text')
    .attr('x', -this.height / 2)
    .attr('y', -95) // Adjust offset as needed
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .style('font-size', `${fontSize}px`)
   
    .style('fill', '#D9D9D9')
    .text('Throughput');

    if (this.target !== undefined) {
      this.svg.append('text')
        .attr('x', this.width - 20)
        .attr('y', y(this.target ?? 0) - 10)
        .attr('text-anchor', 'start')
        .style('font-size', `1.3em`)
        .style('font-weight', `700`)
        .style('fill', '#4CAF50')
        .text(`${this.convertToK(this.target)} (Target)`);
    }

    
    const lastItem = this.data.slice(-1)[0];
    if (lastItem && lastItem.time && lastItem.value !== undefined) {
      this.svg.append('text')
        .attr('x', x(lastItem.time)??0 + 55)
        .attr('y', y(lastItem.value) + 50)
        .attr('text-anchor', 'middle')
        .style('font-size', `1.3em`)
        .style('font-weight', `700`)
        .style('fill', 'white')
        .text(this.formatToThousands(lastItem.value));
    }

    this.drawHeader(fontSize);
    this.drawLegend(fontSize);
    this.drawUpwardArrow(x, y, lastItem ?? 0);
  }

  private drawHeader(fontSize: number): void {
  const headerGroup = this.svg.append('g')
    .attr('class', 'chart-header')
    .attr('transform', `translate(2, 3)`); // move closer to top
const screenwidth=window.innerWidth
const Yval=screenwidth>1600? -10 : 10
  headerGroup.append('text')
  .attr('x', this.width / 2)
  .attr('y', Yval) //
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('font-size', `${fontSize + 6}px`)
    .style('font-weight', '700')
    .style('fill', '#75B709')
    .text('Throughput');
}

  private drawLegend(fontSize: number): void {
  const legendY = 45; // below header
  const legend = this.svg.append('g')
    .attr('class', 'chart-legend')
    .attr('transform', `translate(0, ${legendY})`);

  // Throughput legend
  const throughputLegend = legend.append('g')
    .attr('transform', `translate(${this.width / 4 - 90}, 0)`);
  this.addLegendItem(throughputLegend, 0, 'Throughput', false, fontSize, true);

  // Goal legend
  const goalLegend = legend.append('g')
    .attr('transform', `translate(${this.width / 2}, 0)`);
  this.addLegendItem(goalLegend, 0, 'Goal', true, fontSize, false);
}

  private addLegendItem(group: any, x: number, text: string, isDashed: boolean, fontSize: number, hasDot: boolean): void {
     const font = this.getResponsiveFontSize();
    group.append('line')
      .attr('x1', x+80)
      .attr('y1', 2)
      .attr('x2', x + 50)
      .attr('y2', 2)
      .attr('stroke', 'white')
      .attr('stroke-width', isDashed ? 1 : 2)
      .attr('stroke-dasharray', isDashed ? '5,5' : null);
      if (hasDot) {
    group.append('circle')
      .attr('cx', x + 65)
      .attr('cy', 2)
      .attr('r', 5)
      .attr('fill', 'white');
      }
    group.append('text')
      .attr('x', x + 90)
      .attr('y', 10)
      .text(text)
      .style('font-size', `${font}px`)
      
      
      .style('fill', 'white');
  }

  private drawUpwardArrow(x: any, y: any, lastItem: any): void {
    if (!lastItem?.value) {
      return;
    }
    this.svg.append('defs')
      .append('marker')
      .attr('id', 'up-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 4)
      .attr('refY', 3)
      .attr('markerWidth', 12)
      .attr('markerHeight', 12)
      .attr('orient', '240')
      .append('path')
      .attr('d', 'M 0 0 L 5 10 L 10 0 Z')
      .attr('fill', 'white');

    const verticalExtensionLength = 5;
    
    this.svg.append('line')
      .attr('x1', x(lastItem.time) ?? 0)
      .attr('y1', y(lastItem.value ?? 0))
      .attr('x2', (x(lastItem.time) ?? 0) + 10)
      .attr('y2', y(lastItem.value ?? 0) - verticalExtensionLength)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#up-arrow)');
  }
  getResponsiveFontSize() {
  return Math.max(12, window.innerWidth * 0.02); // At least 12px, or 2% of screen width
}
}

