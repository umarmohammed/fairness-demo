import { Component, Input } from '@angular/core';
import { ScatterService } from './scatter.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'fai-scatter',
  template: `
    <p class="title">Scatter</p>
    <div class="performance-charts">
      <ngx-charts-bubble-chart
        [scheme]="colorScheme"
        [results]="bubbleData"
        [xAxis]="showXAxis"
        [yAxis]="showYAxis"
        [showXAxisLabel]="showXAxisLabel"
        [showYAxisLabel]="showYAxisLabel"
        [xAxisLabel]="metrics.x"
        [yAxisLabel]="metrics.y"
        [yScaleMin]="yScaleMin"
        [yScaleMax]="yScaleMax"
        [minRadius]="minRadius"
        [maxRadius]="maxRadius"
      >
      </ngx-charts-bubble-chart>
    </div>
    <div class="select-grid">
      <div class="select-container">
        <mat-form-field>
          <mat-label>x</mat-label>
          <mat-select
            (selectionChange)="onSelectionChange('x', $event)"
            [value]="metrics.x"
          >
            <mat-option *ngFor="let metric of metrics.xs" [value]="metric.name">
              {{ metric.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>y</mat-label>
          <mat-select
            (selectionChange)="onSelectionChange('y', $event)"
            [value]="metrics.y"
          >
            <mat-option *ngFor="let metric of metrics.ys" [value]="metric.name">
              {{ metric.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }
      .performance-charts {
        display: flex;
        height: 100%;
        width: 100%;
      }

      .title {
        margin: 0 auto;
        font-weight: 500;
      }

      .select-grid {
        display: grid;
        padding: 0 45px;
      }

      .select-container {
        display: grid;
        grid-template-columns: 200px 200px;
        gap: 10px;
        width: 100%;
      }
    `,
  ],
})
export class ScatterChartComponent {
  @Input() metrics: any;

  bubbleData = [
    {
      name: 'Germany',
      series: [
        {
          name: '2010',
          x: '2010',
          y: 80.3,
          r: 80.4,
        },
        {
          name: '2000',
          x: '2000',
          y: 80.3,
          r: 78,
        },
        {
          name: '1990',
          x: '1990',
          y: 75.4,
          r: 79,
        },
      ],
    },
    {
      name: 'United States',
      series: [
        {
          name: '2010',
          x: '2010',
          y: 78.8,
          r: 310,
        },
        {
          name: '2000',
          x: '2000',
          y: 76.9,
          r: 283,
        },
        {
          name: '1990',
          x: '1990',
          y: 75.4,
          r: 253,
        },
      ],
    },
    {
      name: 'France',
      series: [
        {
          name: '2010',
          x: '2010',
          y: 81.4,
          r: 63,
        },
        {
          name: '2000',
          x: '2000',
          y: 79.1,
          r: 59.4,
        },
        {
          name: '1990',
          x: '1990',
          y: 77.2,
          r: 56.9,
        },
      ],
    },
    {
      name: 'United Kingdom',
      series: [
        {
          name: '2010',
          x: '2010',
          y: 80.2,
          r: 62.7,
        },
        {
          name: '2000',
          x: '2000',
          y: 77.8,
          r: 58.9,
        },
        {
          name: '1990',
          x: '1990',
          y: 75.7,
          r: 57.1,
        },
      ],
    },
  ];

  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Values';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Years';
  maxRadius: number = 20;
  minRadius: number = 5;
  yScaleMin: number = 70;
  yScaleMax: number = 85;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  scatterX$ = this.scatterService.scatterX$;
  scatterY$ = this.scatterService.scatterY$;

  constructor(private scatterService: ScatterService) {}

  onSelectionChange(axis: string, matSelectChange: MatSelectChange) {
    this.scatterService.setScatter(axis, matSelectChange.value);
  }
}
