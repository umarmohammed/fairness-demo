import { Component } from '@angular/core';
import { FeaturesService } from './features.service';

@Component({
  selector: 'fai-title',
  template: `
    <p class="mat-h2 title-text" *ngIf="groupNames$ | async as groupNames">
      <span>Unpriveleged Group:</span>
      {{ groupNames[0] }} /
      <span>Priveleged Group:</span>
      {{ groupNames[1] }}
    </p>
  `,
  styles: [
    `
      .title-text {
        margin: auto;
      }
    `,
  ],
})
export class TitleComponent {
  groupNames$ = this.featuresService.groupNames$;

  constructor(private featuresService: FeaturesService) {}
}
