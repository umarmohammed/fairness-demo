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
        [results]="metrics.data"
        [xAxis]="true"
        [yAxis]="true"
        [showXAxisLabel]="true"
        [showYAxisLabel]="true"
        [xAxisLabel]="metrics.x"
        [yAxisLabel]="metrics.y"
        [yScaleMin]="0"
        [yScaleMax]="1"
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

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(private scatterService: ScatterService) {}

  onSelectionChange(axis: string, matSelectChange: MatSelectChange) {
    this.scatterService.setScatter(axis, matSelectChange.value);
  }
}
