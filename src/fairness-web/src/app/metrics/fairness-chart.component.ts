import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

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
        [lineChart]="metric.lineSeries"
        [yLeftAxisScaleFactor]="yAxisScale(metric.name, axisScales)"
        [yRightAxisScaleFactor]="yAxisScale(metric.name, axisScales)"
        [yAxis]="true"
        [rangeFillOpacity]="0.1"
        [showDataLabel]="true"
      >
      </combo-chart-component>
    </fai-chart-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FairnessChartComponent {
  @Input() metric: any;

  scheme = { domain: ['#59a1cf'] };

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
}
