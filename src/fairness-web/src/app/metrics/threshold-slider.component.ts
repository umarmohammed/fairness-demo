import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThresholdService } from './threshold.service';

@Component({
  selector: 'fai-threshold-slider',
  template: `
    <p>Threshold</p>
    <mat-slider
      [max]="1"
      [min]="0"
      [step]="0.02"
      [value]="threshold$ | async"
      (input)="updateThreshold($event.value)"
      class="opacity-slider"
    ></mat-slider>
    <p>{{ threshold$ | async | number: '1.2-2' }}</p>
  `,
  styles: [
    `
      :host {
        display: flex;
        padding: 10px;
        align-items: center;
        max-width: 400px;
      }
      mat-slider {
        flex: 1;
        margin: 0 5px;
      }
      p {
        padding-top: 1px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThresholdSliderComponent {
  threshold$ = this.thresholdService.threshold$;

  constructor(private thresholdService: ThresholdService) {}

  updateThreshold(value: number) {
    this.thresholdService.updateThreshold(value);
  }
}
