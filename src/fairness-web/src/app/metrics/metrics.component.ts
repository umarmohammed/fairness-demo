import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MetricsService } from './metrics.service';
import { Metric } from './metrics';

@Component({
  selector: 'fai-metrics',
  template: `
    <fai-metrics-title class="title"></fai-metrics-title>
    <div [class.hidden]="loading$ | async">
      <div class="performance">
        <p>Performance</p>
        <div class="performance-charts">
          <fai-performance-chart
            *ngFor="
              let metric of performanceMetrics$ | async;
              trackBy: trackByFunction
            "
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsComponent implements OnInit {
  performanceMetrics$ = this.metricsService.performanceMetrics$;
  fairnessMetrics$ = this.metricsService.fairnessMetrics$;
  loading$ = this.metricsService.metricsLoading$;

  constructor(private metricsService: MetricsService) {}

  ngOnInit(): void {
    this.metricsService.metricsPageEntered();
  }

  trackByFunction(_index: number, item: Metric) {
    return item.name;
  }
}
