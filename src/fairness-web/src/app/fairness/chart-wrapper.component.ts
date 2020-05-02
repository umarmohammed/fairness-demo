import { Component, Input } from '@angular/core';
import { Metric } from './metrics';

@Component({
  selector: 'fai-chart-wrapper',
  template: `
    <p class="metric-name">{{ metric.name }}</p>
    <div class="chart-container">
      <ng-content></ng-content>
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
export class ChartWrapperComponent {
  @Input() metric: Metric;
}
