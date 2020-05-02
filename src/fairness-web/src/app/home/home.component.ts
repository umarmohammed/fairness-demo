import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ModelService } from '../core/model.service';
import { Router } from '@angular/router';

@Component({
  selector: 'fai-home',
  template: `
    <div>
      <button (click)="fileInput.click()" color="primary" mat-stroked-button>
        Upload Model
      </button>
      <input
        hidden
        type="file"
        #fileInput
        type="file"
        (change)="fileUploaded(fileInput.files[0])"
        accept=".joblib"
      />
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        align-items: center;
        justify-content: center;
        height: calc(100vh - 64px);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(private modelService: ModelService, private router: Router) {}

  fileUploaded(file: File) {
    this.modelService.loadModel(file);
    this.router.navigate(['/fairness']);
  }
}
