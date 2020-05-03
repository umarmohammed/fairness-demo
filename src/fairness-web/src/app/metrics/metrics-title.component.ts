import { Component } from '@angular/core';
import { FeaturesService } from '../core/features.service';

@Component({
  selector: 'fai-metrics-title',
  template: `<p class="mat-h2">
    <span>Unpriveleged Group:</span>
    {{ unprivelegedGroup$ | async }} /
    <span>Priveleged Group:</span>
    {{ privelegedGroup$ | async }}
  </p>`,
})
export class MetricsTitleComponent {
  privelegedGroup$ = this.featuresService.privelegedGroup$;
  unprivelegedGroup$ = this.featuresService.unprivelegedGroup$;

  constructor(private featuresService: FeaturesService) {}
}
