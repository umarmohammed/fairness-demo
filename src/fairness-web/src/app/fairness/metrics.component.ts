import { Component } from '@angular/core';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'fai-metrics',
  template: `<p>Performance</p>
    <div>{{ performanceMetrics$ | async | json }}</div>`,
  styles: [
    `
      :host {
        background: #fefefe;
        display: grid;
        grid-template-rows: 50px 1fr;
        justify-items: center;
      }
    `,
  ],
})
export class MetricsComponent {
  performanceMetrics$ = this.metricsService.performanceMetrics$;

  constructor(private metricsService: MetricsService) {}
}
