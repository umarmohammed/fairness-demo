import { Component } from '@angular/core';
import { FeaturesService } from '../core/features.service';

@Component({
  selector: 'fai-fairness',
  template: `
    <fai-protected-features></fai-protected-features>
    <fai-metrics></fai-metrics>
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
  features$ = this.featuresService.features$;

  constructor(private featuresService: FeaturesService) {}

  onSelectionChange(event: any) {
    console.log(event);
  }
}
