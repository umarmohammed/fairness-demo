import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FeaturesService } from '../core/features.service';
import { MatSelectChange } from '@angular/material/select';

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
          (selectionChange)="onSelectedFeatureChanged($event)"
          [selectedFeatures]="selectedFeatures$ | async"
        ></fai-select-protected-feaure>
        <fai-select-protected-feaure
          [features]="features$ | async"
          label="Priveleged Group"
          type="gmaj"
          (selectionChange)="onSelectedFeatureChanged($event)"
          [selectedFeatures]="selectedFeatures$ | async"
        ></fai-select-protected-feaure>
      </div>
      <div class="container">
        <p class="header">Model Fix Options</p>
        <mat-form-field>
          <mat-label>Target Metric</mat-label>
          <mat-select
            [value]="selectedFairnessMethod$ | async"
            (selectionChange)="onSelectedFairnessMethodChanged($event)"
          >
            <mat-option
              *ngFor="let metric of targetMetrics$ | async"
              [value]="metric"
            >
              {{ metric }}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Goal</mat-label>
          <input matInput type="number" />
        </mat-form-field>
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
        display: flex;
        flex-direction: column;
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
  targetMetrics$ = this.featuresService.targetMetrics$;
  selectedFairnessMethod$ = this.featuresService.selectedFairnessMethod$;

  constructor(private featuresService: FeaturesService) {}

  onSelectedFeatureChanged(event: { type: string; value: string }) {
    this.featuresService.updateSelectedFeature(event);
  }

  onSelectedFairnessMethodChanged(matSelectChange: MatSelectChange) {
    this.featuresService.updateGoalOptions({
      fairnessMethod: matSelectChange.value,
    });
  }
}
