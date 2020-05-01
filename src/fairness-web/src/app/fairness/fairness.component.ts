import { Component } from '@angular/core';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'fai-fairness',
  template: `
    <fai-protected-features></fai-protected-features>
    <fai-metrics *ngIf="metrics$ | async"></fai-metrics>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-rows: 120px 1fr;
        height: calc(100vh - 64px);
      }
    `,
  ],
})
export class FairnessComponent {
  metrics$ = this.metricsService.metrics$;

  constructor(private metricsService: MetricsService) {}
}
