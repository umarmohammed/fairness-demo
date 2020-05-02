import { Component, Input } from '@angular/core';
import { FairnessMetric } from './metrics';

@Component({
  selector: 'fai-fairness-chart',
  template: `
    <fai-chart-wrapper [metric]="metric">
      <ngx-charts-bar-vertical
        [scheme]="scheme"
        [results]="[metric]"
        [yScaleMin]="-1"
        [yScaleMax]="1"
        [yAxis]="true"
        [showDataLabel]="true"
      >
      </ngx-charts-bar-vertical>
    </fai-chart-wrapper>
  `,
})
export class FairnessChartComponent {
  @Input() metric: FairnessMetric;

  scheme = { domain: ['#1f77b4'] };
}
