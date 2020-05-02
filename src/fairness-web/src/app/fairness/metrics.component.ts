import { Component } from '@angular/core';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'fai-metrics',
  template: `
    <div class="performance">
      <p>Performance</p>
      <div class="performance-charts">
        <div
          *ngFor="let metric of performanceMetrics$ | async"
          class="chart-wrapper"
        >
          <fai-performance-chart [metric]="metric"></fai-performance-chart>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        background: #fefefe;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .performance {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .performance-charts {
        display: flex;
      }

      .chart-wrapper {
        width: calc(100vw / 6);
      }
    `,
  ],
})
export class MetricsComponent {
  performanceMetrics$ = this.metricsService.performanceMetrics$;

  constructor(private metricsService: MetricsService) {}
}
