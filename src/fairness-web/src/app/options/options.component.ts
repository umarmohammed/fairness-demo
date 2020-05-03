import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FeaturesService } from '../core/features.service';

@Component({
  selector: 'fai-options',
  template: `
    <div [class.hidden]="featuresLoading$ | async">
      <div class="container">
        <p class="header">Protected Features</p>

        <fai-select-protected-feaure
          [features]="features$ | async"
          label="Unpriveleged Group"
          type="gmin"
          (selectionChange)="onSelectionChange($event)"
          [selectedFeatures]="selectedFeatures$ | async"
        ></fai-select-protected-feaure>
        <fai-select-protected-feaure
          [features]="features$ | async"
          label="Priveleged Group"
          type="gmaj"
          (selectionChange)="onSelectionChange($event)"
          [selectedFeatures]="selectedFeatures$ | async"
        ></fai-select-protected-feaure>
      </div>
      <div class="container">
        <p class="header">Model Fix Options</p>
        <div>Options to with fixing the model will go here</div>
      </div>
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
        border: 1px solid #f0f0f0;
        padding: 10px;
        border-radius: 5px;
        width: 600px;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 'header header';
        column-gap: 10px;
        margin: 10px;
      }

      .header {
        grid-area: header;
      }
      fai-select-protected-feaure {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent {
  featuresLoading$ = this.featuresService.featuresLoading$;
  features$ = this.featuresService.features$;
  selectedFeatures$ = this.featuresService.selectedFeatures$;

  constructor(private featuresService: FeaturesService) {}

  onSelectionChange(event: { type: string; value: string }) {
    this.featuresService.updateSelectedFeature(event);
  }
}
