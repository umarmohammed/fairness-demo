import { Component, Input } from '@angular/core';
import { Metrics, PerformanceMetric } from './metrics';

@Component({
  selector: 'fai-scatter',
  template: `
    <p class="title">Scatter</p>
    <div class="performance-charts">
      <ngx-charts-custom-bar-vertical
        [results]="metrics.performance"
        [yScaleMin]="0"
        [yScaleMax]="1"
        [yAxis]="true"
        [showDataLabel]="true"
        [xAxis]="true"
      >
      </ngx-charts-custom-bar-vertical>
    </div>
    <div class="select-grid">
      <div class="select-container">
        <mat-form-field>
          <mat-label>x</mat-label>
          <mat-select>
            <mat-option
              *ngFor="let metric of metrics.fairness"
              [value]="metric.name"
            >
              {{ metric.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>y</mat-label>
          <mat-select>
            <mat-option
              *ngFor="let metric of metrics.performance"
              [value]="metric.name"
            >
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
        justify-content: center;
      }

      .select-container {
        display: grid;
        grid-template-columns: 200px 200px;
        gap: 10px;
        width: 100%;
        align-items: center;
        margin: auto;
      }
    `,
  ],
})
export class ScatterChartComponent {
  @Input() metrics: Metrics;
}
