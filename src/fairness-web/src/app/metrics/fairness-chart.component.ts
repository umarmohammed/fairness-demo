import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { metricIsFair } from './metrics.service';

// Running out of time so this part is a hack
@Component({
  selector: 'fai-fairness-chart',
  template: `
    <fai-chart-wrapper [metric]="metric">
      <combo-chart-component
        class="chart-container"
        [scheme]="scheme(metric)"
        [colorSchemeLine]="lineChartScheme"
        [results]="[metric]"
        [lineChart]="metric.lineSeries"
        [yLeftAxisScaleFactor]="yAxisScale(metric.name)"
        [yRightAxisScaleFactor]="yAxisScale(metric.name)"
        [yAxis]="true"
        [rangeFillOpacity]="0.1"
        [showDataLabel]="true"
        [ticks]="ticks(metric.name)"
      >
      </combo-chart-component>
    </fai-chart-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FairnessChartComponent {
  @Input() metric: any;

  scheme(metric: any) {
    function getColor() {
      return metricIsFair(metric) ? '#5ab769' : '#f4523b';
    }

    return { domain: [getColor()] };
  }

  lineChartScheme = {
    domain: ['#545454'],
  };

  ticks(name: string) {
    const axisTicks = {
      'Cohen-D': [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3],
      '2-SD Rule': [-3, -2, -1, 0, 1, 2, 3],
      StatParity: [-0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2],
      EqualOppDiff: [-0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2],
      DispImpact: [-3, -2, -1, 0, 1, 2, 3],
      AvgOddsDiff: [-0.2, -0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15, 0.2],
    };

    return axisTicks[name];
  }

  yAxisScale(name: string) {
    const axisScales = {
      'Cohen-D': { min: '-0.3', max: '0.3' },
      '2-SD Rule': { min: '-3', max: '3' },
      StatParity: { min: '-0.2', max: '0.2' },
      EqualOppDiff: { min: '-0.2', max: '0.2' },
      DispImpact: { min: '-3', max: '3' },
      AvgOddsDiff: { min: '-0.2', max: '0.2' },
    };

    return (min: number, max: number) =>
      axisScales[name] || { min: `${min}`, max: `${max}` };
  }
}
