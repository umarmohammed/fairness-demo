import { Component } from '@angular/core';
import { FairModelService } from './fair-model.service';
import { Metric } from './metrics';

@Component({
  selector: 'fai-fair-model-compare',
  template: `<div class="metrics">
    <div class="chart-row">
      <div class="performance">
        <ngx-charts-custom-bar-vertical-2d
          [results]="fairModelComparePerformance$ | async"
          [yScaleMax]="1"
          [yAxis]="true"
          [showDataLabel]="true"
          [xAxis]="true"
          [legend]="true"
          [roundEdges]="false"
        >
        </ngx-charts-custom-bar-vertical-2d>
      </div>
      <div class="performance chart">
        <p class="title">Acceptance Rate %</p>
        <div style="height:100%;">
          <ngx-charts-custom-bar-vertical-2d
            [results]="dfplot$ | async"
            [yScaleMax]="100"
            [yAxis]="true"
            [showDataLabel]="true"
            [xAxis]="true"
            [legend]="true"
            [roundEdges]="false"
          ></ngx-charts-custom-bar-vertical-2d>
        </div>
      </div>
    </div>

    <div class="chart fairness">
      <p class="title">Fairness</p>
      <div class="performance-charts">
        <fai-fairness-chart
          *ngFor="
            let metric of fairModelFairness$ | async;
            trackBy: trackByFunction
          "
          [metric]="metric"
          class="chart-wrapper"
        ></fai-fairness-chart>
      </div>
      <div>
        <fai-threshold-slider></fai-threshold-slider>
      </div>
    </div>
  </div>`,
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
        width: calc(50% - 5px);
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
})
export class FairModelCompareComponent {
  fairModelComparePerformance$ = this.fairModelService
    .fairModelComparePerformance$;
  fairModelFairness$ = this.fairModelService.fairModelFairness$;
  dfplot$ = this.fairModelService.fairModelCompareAcceptanceRate$;

  constructor(private fairModelService: FairModelService) {}

  trackByFunction(_index: number, item: Metric) {
    return item.name;
  }
}
