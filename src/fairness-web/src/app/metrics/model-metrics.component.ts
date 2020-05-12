import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MetricsService } from './metrics.service';
import { Metric } from './metrics';

@Component({
  selector: 'fai-model-metrics',
  template: `
    <nav mat-tab-nav-bar>
      <a
        mat-tab-link
        routerLink="foo"
        routerLinkActive
        #rla="routerLinkActive"
        [active]="rla.isActive"
      >
        Metrics
      </a>
      <a
        mat-tab-link
        routerLink="trade-offs"
        routerLinkActive
        #rla1="routerLinkActive"
        [active]="rla1.isActive"
      >
        Trade-offs
      </a>
    </nav>
    <div style="height: calc(100% - 49px)">
      <router-outlet></router-outlet>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelMetricsComponent {}
