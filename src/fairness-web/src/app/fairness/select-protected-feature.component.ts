import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'fai-select-protected-feaure',
  template: `
    <mat-form-field>
      <mat-label>{{ label }}</mat-label>
      <mat-select (selectionChange)="onSelectionChange($event)">
        <mat-option *ngFor="let feature of features" [value]="feature">
          {{ feature }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class SelectProtectedFeatureComponent {
  @Input() label: string;
  @Input() features: string[];
  @Input() type: string;

  @Output() selectionChange = new EventEmitter<{
    type: string;
    value: string;
  }>();

  onSelectionChange(matSelectChange: MatSelectChange) {
    this.selectionChange.emit({
      type: this.type,
      value: matSelectChange.value,
    });
  }
}
