import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MetricsService } from './metrics.service';
import { Metric } from './metrics';

@Component({
  selector: 'fai-metrics',
  template: `
    <fai-metrics-title class="title"></fai-metrics-title>
    <div *ngIf="error$ | async as error" class="error">
      There was an error getting metrics for these features.
    </div>
    <div *ngIf="metrics$ | async as metrics">
      <div class="performance">
        <p>Performance</p>
        <div class="performance-charts">
          <fai-performance-chart
            *ngFor="let metric of metrics.performance; trackBy: trackByFunction"
            class="chart-wrapper"
            [metric]="metric"
          ></fai-performance-chart>
        </div>
      </div>
      <fai-threshold-slider></fai-threshold-slider>
      <div class="performance">
        <p>Fairness</p>
        <div class="performance-charts">
          <fai-fairness-chart
            *ngFor="let metric of metrics.fairness; trackBy: trackByFunction"
            [metric]="metric"
            class="chart-wrapper"
          ></fai-fairness-chart>
        </div>
      </div>
    </div>
    <div>
      <mat-spinner
        class="spinner"
        [class.show]="loading$ | async"
      ></mat-spinner>
    </div>
  `,
  styles: [
    `
      :host {
        background: #fdfdfd;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 64px);
      }

      .performance {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
      }

      .performance-charts {
        display: flex;
      }

      .chart-wrapper {
        width: calc((100vw - 10px) / 6);
      }

      .title {
        margin: 10px auto 0;
      }

      .error {
        color: #721c24;
        background-color: #f8d7da;
        border-color: #f5c6cb;
        padding: 0.75rem 1.25rem;
        border: 1px solid transparent;
        border-radius: 0.25rem;
        margin: 50px auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsComponent {
  loading$ = this.metricsService.metricsLoading$;
  metrics$ = this.metricsService.metricsForThreshold$;
  error$ = this.metricsService.error$;

  constructor(private metricsService: MetricsService) {}

  trackByFunction(_index: number, item: Metric) {
    return item.name;
  }
}
