import { Component, Input } from '@angular/core';
import { PerformanceService } from './performance.service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'fai-performance-chart',
  template: `
    <mat-radio-group
      aria-label="Select an option"
      class="radio-group"
      [value]="performanceType$ | async"
      (change)="onValueChange($event)"
    >
      <mat-radio-button value="single">Single</mat-radio-button>
      <mat-radio-button value="multi">Multi</mat-radio-button>
    </mat-radio-group>
    <p class="title">Performance</p>
    <div class="performance-charts">
      <ngx-charts-bar-vertical-2d
        *ngIf="metrics && metrics.type == 'multi'; else elseBlock"
        [results]="metrics.values"
        [yScaleMax]="1"
        [yAxis]="true"
        [showDataLabel]="true"
        [xAxis]="true"
        [legend]="true"
        [roundEdges]="false"
      >
      </ngx-charts-bar-vertical-2d>

      <ng-template #elseBlock>
        <ngx-charts-custom-bar-vertical
          [results]="metrics.values"
          [yScaleMin]="0"
          [yScaleMax]="1"
          [yAxis]="true"
          [showDataLabel]="true"
          [xAxis]="true"
          [roundEdges]="false"
        >
        </ngx-charts-custom-bar-vertical
      ></ng-template>
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

      .radio-group {
        margin-left: 10px;
      }

      .mat-radio-button ~ .mat-radio-button {
        margin-left: 16px;
      }
    `,
  ],
})
export class PerformanceChartComponent {
  @Input() metrics: any;

  performanceType$ = this.performanceService.performanceType$;

  constructor(private performanceService: PerformanceService) {}

  onValueChange(matRadioChange: MatRadioChange) {
    this.performanceService.setPerformanceType(matRadioChange.value);
  }
}
