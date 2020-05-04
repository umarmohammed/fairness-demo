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
    <div *ngIf="metrics$ | async as metrics" class="metrics">
      <div class="chart-row performance">
        <p class="title">Performance</p>
        <div class="performance-charts">
          <ngx-charts-bar-vertical
            [results]="metrics.performance"
            [yScaleMin]="0"
            [yScaleMax]="1"
            [yAxis]="true"
            [showDataLabel]="true"
            [xAxis]="true"
          >
          </ngx-charts-bar-vertical>
        </div>
      </div>
      <fai-threshold-slider></fai-threshold-slider>
      <div class="chart-row fairness">
        <p class="title">Fairness</p>
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
      .metrics {
        height: 100%;
      }

      :host {
        background: #fdfdfd;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 64px);
      }

      .performance {
        height: 400px;
        width: 50%;
      }

      .chart-row {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
      }

      .performance-charts {
        display: flex;
        height: 100%;
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

      .chart-row .title {
        margin: auto;
        font-weight: 500;
      }

      .chart-row.fairness .title {
        margin: 0 auto 20px;
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
