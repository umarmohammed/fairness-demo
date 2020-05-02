import { Component, Input } from '@angular/core';
import { PerformanceMetric } from './metrics';

@Component({
  selector: 'fai-performance-chart',
  template: `
    <p class="metric-name">{{ metric.name }}</p>
    <div class="chart-container">
      <ngx-charts-bar-vertical
        [scheme]="scheme"
        [results]="[metric]"
        [yScaleMin]="0"
        [yScaleMax]="1"
        [yAxis]="true"
        [showDataLabel]="true"
      >
      </ngx-charts-bar-vertical>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }
      .metric-name {
        margin: auto;
      }
      .chart-container {
        width: 100%;
        height: 250px;
      }
    `,
  ],
})
export class PerformanceChartComponent {
  @Input() metric: PerformanceMetric;

  scheme = { domain: ['#1f77b4'] };
}
