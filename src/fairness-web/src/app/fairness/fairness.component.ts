import { Component } from '@angular/core';
import { FeaturesService } from '../core/features.service';

@Component({
  selector: 'fai-fairness',
  template: `
    <div class="container">
      <p class="header">Protected Features</p>

      <mat-form-field>
        <mat-label>gmin</mat-label>
        <mat-select (selectionChange)="onSelectionChange($event)">
          <mat-option
            *ngFor="let feature of features$ | async"
            [value]="feature"
          >
            {{ feature }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>gmaj</mat-label>
        <mat-select (selectionChange)="onSelectionChange($event)">
          <mat-option
            *ngFor="let feature of features$ | async"
            [value]="feature"
          >
            {{ feature }}
          </mat-option>
        </mat-select>
      </mat-form-field>
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
      mat-form-field {
        width: 100%;
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
