import { Component } from '@angular/core';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'fai-metrics',
  template: `
    <div class="performance">
      <p>Performance</p>
      <div class="performance-charts">
        {{ performanceMetrics$ | async | json }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        background: #fefefe;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .performance {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .performance-charts {
        flex: 1;
      }
    `,
  ],
})
export class MetricsComponent {
  performanceMetrics$ = this.metricsService.performanceMetrics$;

  constructor(private metricsService: MetricsService) {}
}
