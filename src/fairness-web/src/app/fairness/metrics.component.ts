import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'fai-metrics',
  template: `
    <fai-threshold-slider></fai-threshold-slider>
    <div class="performance">
      <p>Performance</p>
      <div class="performance-charts">
        <fai-performance-chart
          *ngFor="let metric of performanceMetrics$ | async"
          class="chart-wrapper"
          [metric]="metric"
        ></fai-performance-chart>
      </div>
    </div>
    <div class="performance">
      <p>Fairness</p>
      <div class="performance-charts">
        <fai-fairness-chart
          *ngFor="let metric of fairnessMetrics$ | async"
          [metric]="metric"
          class="chart-wrapper"
        ></fai-fairness-chart>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        background: #fdfdfd;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .performance {
        display: flex;
        flex-direction: column;
        padding: 10px;
      }

      .performance-charts {
        display: flex;
      }

      .chart-wrapper {
        width: calc((100vw - 10px) / 6);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsComponent {
  performanceMetrics$ = this.metricsService.performanceMetrics$;
  fairnessMetrics$ = this.metricsService.fairnessMetrics$;

  constructor(private metricsService: MetricsService) {}
}
