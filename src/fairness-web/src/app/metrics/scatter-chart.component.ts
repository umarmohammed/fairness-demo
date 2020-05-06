import { Component, Input } from '@angular/core';
import { Metrics, PerformanceMetric } from './metrics';

@Component({
  selector: 'fai-scatter',
  template: `
    <p class="title">Scatter</p>
    <div class="performance-charts">
      <ngx-charts-custom-bar-vertical
        [results]="performance"
        [yScaleMin]="0"
        [yScaleMax]="1"
        [yAxis]="true"
        [showDataLabel]="true"
        [xAxis]="true"
      >
      </ngx-charts-custom-bar-vertical>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }
      .performance-charts {
        display: flex;
        height: 100%;
        width: 100%;
      }

      .title {
        margin: 0 auto;
        font-weight: 500;
      }
    `,
  ],
})
export class ScatterChartComponent {
  @Input() performance: PerformanceMetric[];
}
