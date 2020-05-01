import { Component } from '@angular/core';
import { FeaturesService } from '../core/features.service';

@Component({
  selector: 'fai-fairness',
  template: ` <fai-protected-features></fai-protected-features> `,
})
export class FairnessComponent {
  features$ = this.featuresService.features$;

  constructor(private featuresService: FeaturesService) {}

  onSelectionChange(event: any) {
    console.log(event);
  }
}
