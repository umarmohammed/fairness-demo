import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MetricsService } from './metrics.service';
import { Metric } from './metrics';

@Component({
  selector: 'fai-metrics',
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav mode="side" [opened]="true">
        <mat-nav-list>
          <a mat-list-item routerLink="data" routerLinkActive="active">Data</a>
          <a mat-list-item routerLink="model" routerLinkActive="active"
            >Model</a
          >
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      mat-sidenav-container {
        height: calc(100% - 64px);
      }
      .active {
        background: #f5f5f5;
      }

      mat-sidenav {
        width: 200px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsComponent {
  loading$ = this.metricsService.metricsLoading$;
  metrics$ = this.metricsService.metricsForThreshold$;
  error$ = this.metricsService.error$;

  constructor(private metricsService: MetricsService) {}

  trackByFunction(_index: number, item: Metric) {
    return item.name;
  }
}
