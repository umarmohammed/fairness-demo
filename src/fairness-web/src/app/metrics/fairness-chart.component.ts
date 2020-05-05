import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

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
    function metricIsFair() {
      return metric.thresholds.length === 1
        ? metric.value === metric.thresholds[0]
        : metric.value <= metric.thresholds[0] &&
            metric.value >= metric.thresholds[2];
    }

    function getColor() {
      return metricIsFair() ? '#5ab769' : '#f4523b';
    }

    return { domain: [getColor()] };
  }

  lineChartScheme = {
    domain: ['#545454'],
  };

  ticks(name: string) {
    return name === '2-SD Rule' || name === 'DispImpact'
      ? [-3, -2, -1, 0, 1, 2, 3]
      : [-1, -0.5, 0, 0.5, 1];
  }

  yAxisScale(name: string) {
    const axisScales = {
      'Cohen-D': { min: '-1', max: '1' },
      '2-SD Rule': { min: '-3', max: '3' },
      StatParity: { min: '-1', max: '1' },
      EqualOppDiff: { min: '-1', max: '1' },
      DispImpact: { min: '-3', max: '3' },
      AvgOddsDiff: { min: '-1', max: '1' },
    };

    return (min: number, max: number) =>
      axisScales[name] || { min: `${min}`, max: `${max}` };
  }
}
