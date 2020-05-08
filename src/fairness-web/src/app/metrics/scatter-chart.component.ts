import { Component, Input } from '@angular/core';
import { ScatterService } from './scatter.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'fai-scatter',
  template: `
    <div class="select-grid">
      <div class="select-container">
        <mat-form-field>
          <mat-label>x</mat-label>
          <mat-select
            (selectionChange)="onSelectionChange('x', $event)"
            [value]="metrics.x"
          >
            <mat-option *ngFor="let metric of metrics.xs" [value]="metric">
              {{ metric }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>y</mat-label>
          <mat-select
            (selectionChange)="onSelectionChange('y', $event)"
            [value]="metrics.y"
          >
            <mat-option *ngFor="let metric of metrics.ys" [value]="metric">
              {{ metric }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </div>
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
        [yScaleMax]="1.1"
        [roundDomains]="true"
        [legend]="true"
      >
      </ngx-charts-bubble-chart>
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
        width: calc(100% - 5px);
      }

      .title {
        margin: 0 auto;
        font-weight: 500;
      }

      .select-grid {
        display: grid;
        margin-left: 75px;
        margin-top: 5px;
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
    domain: ['#5ab769', '#f4523b'],
  };

  constructor(private scatterService: ScatterService) {}

  onSelectionChange(axis: string, matSelectChange: MatSelectChange) {
    this.scatterService.setScatter(axis, matSelectChange.value);
  }
}
