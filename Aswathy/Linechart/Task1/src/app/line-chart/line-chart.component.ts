import { Component, ElementRef, HostListener, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
interface ThroughputData {
  time: string;
  value: number;
}
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {

 @Input() data: any = [];
  
  @Input() target:any;

  private svg: any;
  private margin = { top: 40, right: 60, bottom: 50, left: 50 };
  private width = 0;
  private height = 0;
  private aspectRatio = 1.225; 

  constructor(private elementRef: ElementRef) {}

  @HostListener('window:resize')
  onResize() {
    this.updateChart();
  }

  ngOnInit(): void {
    this.updateChart();
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
    const containerWidth = container.clientWidth;
    



const width = window.innerWidth;
const isMobileS = width < 375; 
const isMobile = width < 768;

this.margin = isMobileS
  ? { top: 220, right: 30, bottom: 30, left: 70 }  
  : isMobile
    ? { top: 160, right: 30, bottom: 30, left: 70 }
    : { top: 60, right: 60, bottom: 50, left: 50 };

  
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
      .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right+100} ${this.height + this.margin.top + this.margin.bottom+40}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
     
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  private drawChart(): void {
    
    this.svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', '#0a192f');

  
    const x = d3.scalePoint()
  .domain((this.data?.length ? this.data : [
    { time: '00:00', value: 0 }
  ]).map((d: any) => d.time))
  .range([20, this.width + 50]);

    const values = (this.data ?? []).map((item: any) => item.value);
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
       const roundedMaxValue = Math.ceil(maxValue / 100) * 100;
       const extraPadding = 250
      //  const yLabel= roundedMaxValue>this.target ? roundedMaxValue : this.target ?? 0; 
    const yLabel = Math.max(roundedMaxValue, this.target ?? 0, 6000);
   
    const y = d3.scaleLinear()
      .domain([0, yLabel])
      .range([this.height, this.height * 0.2]);


    const yGridLines = d3.axisLeft(y)
      .tickSize(-this.width*1.2)
      .tickFormat(() => '')
      .ticks(10);

    this.svg.append('g')
    
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
//---------------------------------------
      this.svg.selectAll('.vertical-line')
  .data(this.data)
  .enter()
  .append('line')
  .attr('class', 'vertical-line')
  .attr('x1', (d: any) => x(d.time))
  .attr('x2', (d: any) => x(d.time))
  .attr('y1', 0)
  .attr('y2', this.height)
  .attr('stroke', '#D9D9D9')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '2,2');
//----------------------------------------------
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
          // .attr('stroke', 'white')
          .attr('stroke', '#3B82F6')
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
      .attr('stroke', '#3B82F6')
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
      .attr('fill', 'red');

    const fontSize = Math.max(14, Math.min(26, this.width / 30)); 
 

  this.svg.append('text')
    .attr('x', this.width / 2)
    .attr('y', this.height + 70) 
    .attr('text-anchor', 'middle')
    .style('font-size', `${fontSize}px`)
    .style('fill', '#D9D9D9')
    .text('Shift Progress Hour');


  this.svg.append('text')
    .attr('x', -this.height / 2)

    .attr('y', () => window.innerWidth < 768 ? -40 : -95)
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

    
    const lastItem  = this.data.slice(-1)[0];
    if (lastItem && lastItem.time && lastItem.value !== undefined) {
      this.svg.append('text')
        .attr('x', (x(lastItem.time)??0) + 55)
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
 

// const headerYOffset = window.innerWidth < 375 ? -160 : (window.innerWidth < 768 ? -140 : -30);
const headerYOffset = window.innerWidth < 375 ? -150 : (window.innerWidth < 768 ? -120 : -20);
const headerGroup = this.svg.append('g')
  .attr('class', 'chart-header')
 
.attr('transform', `translate(${this.width / 2 - 100}, ${headerYOffset})`);
    headerGroup.append('text')
      .attr('x', this.width / 6)
      .attr('y', 7)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', `1.5em`)
      .style('font-weight', '700')
      .style('fill', '#75B709')
      .text('Throughput');
  }

  private drawLegend(fontSize: number): void {
    
  //   const legendYOffset = window.innerWidth < 375
  // ? -80    
  // : window.innerWidth < 768
  //   ? -60  
  //   : this.margin.top + 20;  
   
const legendYOffset = window.innerWidth < 375
  ? -110
  : window.innerWidth < 768
    ? -80
    : this.margin.top - 10;


const legend = this.svg.append('g')
  .attr('class', 'chart-legend')
  .attr('transform', `translate(${this.width / 4 - 90}, ${legendYOffset})`);

const throughputLegend = legend.append('g');
this.addLegendItem(throughputLegend, 0, 'Throughput', false, 32, true);

const goalLegend = legend.append('g')
    .attr('transform', `translate(${this.width / 2}, 0)`);
  this.addLegendItem(goalLegend, 0, 'Goal', true, 32, false);


  }

  private addLegendItem(group: any, x: number, text: string, isDashed: boolean, fontSize: number, hasDot: boolean): void {
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

      const smallFont = window.innerWidth < 375 ? '11px' : (window.innerWidth < 768 ? '12px' : `${fontSize}px`);
    group.append('text')
      .attr('x', x + 90)
      .attr('y', 10)
      .text(text)
    
       .style('font-size', smallFont)
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
}
