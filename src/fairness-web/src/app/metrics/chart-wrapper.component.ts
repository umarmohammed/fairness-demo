import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Metric } from './metrics';

@Component({
  selector: 'fai-chart-wrapper',
  template: `
    <div class="chart-container">
      <ng-content></ng-content>
    </div>
    <p class="metric-name">{{ metric.name }}</p>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .metric-name {
        margin: 5px auto;
      }
      .chart-container {
        width: 100%;
        height: 250px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartWrapperComponent {
  @Input() metric: Metric;
}
