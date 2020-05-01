import { Component } from '@angular/core';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'fai-metrics',
  template: `<div>{{ metrics$ | async }}</div>`,
  styles: [
    `
      :host {
        background: #fefefe;
      }
    `,
  ],
})
export class MetricsComponent {
  metrics$ = this.metricsService.metrics$;

  constructor(private metricsService: MetricsService) {}
}
