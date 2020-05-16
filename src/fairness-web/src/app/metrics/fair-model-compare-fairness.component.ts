import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { metricIsFair } from './metrics.service';

@Component({
  selector: 'fai-fair-model-compare-fairness',
  template: ` <fai-chart-wrapper [metric]="metric">
    <combo-chart-component
      class="chart-container"
      [scheme]="scheme(metric)"
      [colorSchemeLine]="lineChartScheme"
      [results]="metric.values"
      [lineChart]="metric.lineSeries"
      [yLeftAxisScaleFactor]="yAxisScale(metric.name)"
      [yRightAxisScaleFactor]="yAxisScale(metric.name)"
      [yAxis]="true"
      [rangeFillOpacity]="0.1"
      [showDataLabel]="true"
      [ticks]="ticks(metric.name)"
      [tooltipDisabled]="true"
      [xAxis]="true"
    >
    </combo-chart-component>
  </fai-chart-wrapper>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FairModelCompareFairness {
  @Input() metric: any;

  scheme(metric: any) {
    function getColor() {
      return metric.values.map((m) =>
        metricIsFair({ ...metric, ...m }) ? '#5ab769' : '#f4523b'
      );
    }

    return { domain: getColor() };
  }

  lineChartScheme = {
    domain: ['#545454', '#545454'],
  };

  ticks(name: string) {
    const axisTicks = {
      'Cohen-D': [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3],
      '2-SD Rule': [-3, -2, -1, 0, 1, 2, 3],
      StatParity: [-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15],
      EqualOppDiff: [-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15],
      DispImpact: [-3, -2, -1, 0, 1, 2, 3],
      AvgOddsDiff: [-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15],
    };

    return axisTicks[name];
  }

  yAxisScale(name: string) {
    const axisScales = {
      'Cohen-D': { min: '-0.3', max: '0.3' },
      '2-SD Rule': { min: '-3', max: '3' },
      StatParity: { min: '-0.15', max: '0.15' },
      EqualOppDiff: { min: '-0.15', max: '0.15' },
      DispImpact: { min: '-3', max: '3' },
      AvgOddsDiff: { min: '-0.15', max: '0.15' },
    };

    return (min: number, max: number) =>
      axisScales[name] || { min: `${min}`, max: `${max}` };
  }
}
