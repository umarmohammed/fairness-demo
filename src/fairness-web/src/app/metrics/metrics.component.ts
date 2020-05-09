import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MetricsService } from './metrics.service';
import { SideNavService } from '../core/side-nav.service';
import { FairModelService } from './fair-model.service';
import { Metric } from './metrics';

@Component({
  selector: 'fai-metrics',
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav mode="side" [opened]="sideNavOpen$ | async">
        <mat-nav-list>
          <a mat-list-item routerLink="data" routerLinkActive="active">Data</a>
          <a mat-list-item routerLink="model" routerLinkActive="active"
            >Model</a
          >
          <a
            mat-list-item
            routerLink="fair-model"
            routerLinkActive="active"
            [disabled]="!(fairModel$ | async)"
            >Fair Model</a
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
        color: #3f51b5;
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
  sideNavOpen$ = this.sideNavService.sideNavOpen$;
  fairModel$ = this.fairModelService.fairModelMetrics$;

  constructor(
    private metricsService: MetricsService,
    private sideNavService: SideNavService,
    private fairModelService: FairModelService
  ) {}

  trackByFunction(_index: number, item: Metric) {
    return item.name;
  }
}
