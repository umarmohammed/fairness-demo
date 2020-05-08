import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'fai-trade-off',
  template: ` <fai-scatter
    *ngIf="scatterMetrics$ | async as metrics"
    [metrics]="metrics"
    class="performance"
  ></fai-scatter>`,
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
        padding-top: 10px;
      }

      .performance {
        width: 100%;
        height: 100%;
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
export class TradeOffComponent {
  scatterMetrics$ = this.metricsService.scatterMetrics$;

  constructor(private metricsService: MetricsService) {}
}
