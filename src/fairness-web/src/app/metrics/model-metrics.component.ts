import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MetricsService } from './metrics.service';
import { Metric } from './metrics';

@Component({
  selector: 'fai-model-metrics',
  template: `
    <fai-metrics-title class="title"></fai-metrics-title>
    <div *ngIf="error$ | async as error" class="error">
      There was an error getting metrics for these features.
    </div>
    <div
      *ngIf="!(error$ | async)"
      [class.hidden]="loading$ | async"
      class="metrics"
    >
      <div class="chart-row">
        <div class="chart performance">
          <p class="title">Performance</p>
          <div class="performance-charts">
            <ngx-charts-custom-bar-vertical
              [results]="performanceMetrics$ | async"
              [yScaleMin]="0"
              [yScaleMax]="1"
              [yAxis]="true"
              [showDataLabel]="true"
              [xAxis]="true"
            >
            </ngx-charts-custom-bar-vertical>
          </div>
          <fai-threshold-slider></fai-threshold-slider>
        </div>
        <fai-scatter
          *ngIf="scatterMetrics$ | async as metrics"
          [metrics]="metrics"
          class="performance"
        ></fai-scatter>
      </div>

      <div class="chart fairness">
        <p class="title">Fairness</p>
        <div class="performance-charts">
          <fai-fairness-chart
            *ngFor="
              let metric of fairnessMetrics$ | async;
              trackBy: trackByFunction
            "
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
        height: 100%;
      }

      .metrics {
        flex: 1;
      }

      .performance {
        width: calc(50% - 5px);
      }

      .chart-row {
        display: flex;
        height: 50%;
        width: 100%;
      }

      .chart {
        display: flex;
        flex-direction: column;
      }

      .performance-charts {
        display: flex;
        height: 100%;
        width: 100%;
      }

      .chart-wrapper {
        width: calc((100% - 10px) / 6);
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

      .chart .title {
        margin: auto;
        font-weight: 500;
      }

      .chart.fairness .title {
        margin: 0 auto 20px;
      }

      .chart.fairness {
        height: 50%;
      }

      fai-threshold-slider {
        margin-left: 5px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelMetricsComponent implements OnInit {
  loading$ = this.metricsService.metricsLoading$;
  performanceMetrics$ = this.metricsService.performanceMetrics$;
  fairnessMetrics$ = this.metricsService.fairnessMetrics$;
  error$ = this.metricsService.error$;
  scatterMetrics$ = this.metricsService.scatterMetrics$;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.metricsService.metricsPageEntered();
  }

  trackByFunction(_index: number, item: Metric) {
    return item.name;
  }
}
