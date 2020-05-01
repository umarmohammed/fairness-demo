import { Component } from '@angular/core';
import { FeaturesService } from '../core/features.service';

@Component({
  selector: 'fai-fairness',
  template: `<div>{{ features$ | async | json }}</div>`,
})
export class FairnessComponent {
  features$ = this.featuresService.features$;

  constructor(private featuresService: FeaturesService) {}
}
