import { Component } from '@angular/core';
import { FeaturesService } from '../core/features.service';

@Component({
  selector: 'fai-protected-features',
  template: `
    <div class="container">
      <p class="header">Protected Features</p>

      <fai-select-protected-feaure
        [features]="features$ | async"
        label="gmin"
      ></fai-select-protected-feaure>
      <fai-select-protected-feaure
        [features]="features$ | async"
        label="gmac"
      ></fai-select-protected-feaure>
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        justify-items: center;
      }

      .container {
        display: grid;
        justify-content: center;
        align-items: center;
        justify-items: center;
        width: 600px;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 'header header';
        column-gap: 10px;
      }
      .header {
        grid-area: header;
      }
      fai-select-protected-feaure {
        width: 100%;
      }
    `,
  ],
})
export class ProtectedFeaturesComponent {
  features$ = this.featureService.features$;

  constructor(private featureService: FeaturesService) {}
}
