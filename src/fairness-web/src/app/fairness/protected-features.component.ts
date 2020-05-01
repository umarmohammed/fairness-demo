import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FeaturesService } from '../core/features.service';

@Component({
  selector: 'fai-protected-features',
  template: `
    <div class="container" [class.hidden]="featuresLoading$ | async">
      <p class="header">Protected Features</p>

      <fai-select-protected-feaure
        [features]="features$ | async"
        label="gmin"
        type="gmin"
        (selectionChange)="onSelectionChange($event)"
        [selectedFeatures]="selectedFeatures$ | async"
      ></fai-select-protected-feaure>
      <fai-select-protected-feaure
        [features]="features$ | async"
        label="gmaj"
        type="gmaj"
        (selectionChange)="onSelectionChange($event)"
        [selectedFeatures]="selectedFeatures$ | async"
      ></fai-select-protected-feaure>
    </div>
    <mat-spinner
      class="spinner"
      [class.show]="featuresLoading$ | async"
    ></mat-spinner>
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
      .hidden {
        display: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtectedFeaturesComponent {
  features$ = this.featureService.features$;
  featuresLoading$ = this.featureService.featuresLoading$;
  selectedFeatures$ = this.featureService.selectedFeatures$;

  constructor(private featureService: FeaturesService) {}

  onSelectionChange(event: { type: string; value: string }) {
    this.featureService.updateSelectedFeature(event);
  }
}
