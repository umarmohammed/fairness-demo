import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThresholdService } from './threshold.service';

@Component({
  selector: 'fai-threshold-slider',
  template: `
    <ng-container *ngIf="slider$ | async as slider">
      <p>Threshold</p>
      <mat-slider
        [max]="slider.range[1]"
        [min]="slider.range[0]"
        [step]="0.02"
        [value]="slider.threshold"
        (input)="updateThreshold($event.value)"
        class="opacity-slider"
      ></mat-slider>
      <p>{{ slider.threshold | number: '1.2-2' }}</p>
    </ng-container>
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
  slider$ = this.thresholdService.slider$;

  constructor(private thresholdService: ThresholdService) {}

  updateThreshold(value: number) {
    this.thresholdService.updateThreshold(value);
  }
}
