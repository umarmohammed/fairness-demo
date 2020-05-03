import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PerformanceMetric } from './metrics';

@Component({
  selector: 'fai-performance-chart',
  template: `
    <fai-chart-wrapper [metric]="metric">
      <ngx-charts-bar-vertical
        [scheme]="scheme"
        [results]="[metric]"
        [yScaleMin]="0"
        [yScaleMax]="1"
        [yAxis]="true"
        [showDataLabel]="showDataLabel"
      >
      </ngx-charts-bar-vertical>
    </fai-chart-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceChartComponent {
  @Input() metric: PerformanceMetric;
  @Input() showDataLabel: boolean;

  scheme = { domain: ['#1f77b4'] };
}
