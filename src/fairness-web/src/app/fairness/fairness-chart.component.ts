import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FairnessMetric } from './metrics';

// Running out of time so this part is a hack
@Component({
  selector: 'fai-fairness-chart',
  template: `
    <fai-chart-wrapper [metric]="metric">
      <combo-chart-component
        class="chart-container"
        [scheme]="scheme"
        [colorSchemeLine]="lineChartScheme"
        [results]="[metric]"
        [lineChart]="getLineChartSeries(metric.name)"
        [yLeftAxisScaleFactor]="yAxisScale(metric.name, axisScales)"
        [yRightAxisScaleFactor]="yAxisScale(metric.name, axisScales)"
        [yAxis]="true"
      >
      </combo-chart-component>
    </fai-chart-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FairnessChartComponent {
  @Input() metric: FairnessMetric;

  scheme = { domain: ['#1f77b4'] };

  lineChartScheme = {
    domain: ['#f00'],
  };

  axisScales = {
    'Cohen-D': { min: '-1', max: '1' },
    '2-SD Rule': { min: '-3', max: '3' },
    StatParity: { min: '-1', max: '1' },
    EqualOppDiff: { min: '-1', max: '1' },
    DispImpact: { min: '-2.5', max: '2.5' },
    AvgOddsDiff: { min: '-1', max: '1' },
  };

  yAxisScale = (name: string, axisScales: any) => (min: number, max: number) =>
    axisScales[name] || { min: `${min}`, max: `${max}` };

  getLineChartSeries(metric: string) {
    return metric === 'DispImpact'
      ? this.createLineChartSeries(1)
      : this.createLineChartSeries(0);
  }

  private createLineChartSeries(value: number) {
    return [
      {
        name: 'Fair',
        series: [
          {
            name: 'USA',
            value,
          },
          {
            value,
            name: 'United Kingdom',
          },
        ],
      },
    ];
  }
}
