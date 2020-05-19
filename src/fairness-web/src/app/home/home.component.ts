import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ModelService } from '../core/model.service';
import { Router } from '@angular/router';

@Component({
  selector: 'fai-home',
  template: `
    <div class="container">
      <img class="logo" src="/assets/logo.PNG" />
      <div class="text-container">
        <h1 class="title">Fairness Demo</h1>
        <button
          (click)="fileInput.click()"
          color="primary"
          mat-stroked-button
          class="upload-button"
        >
          Connect
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
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      .title {
        width: 100%;
        text-align: center;
      }

      .text-container {
        width: 215px;
        display: flex;
        flex-direction: column;
        margin: auto;
      }

      .logo {
        margin: auto;
      }

      .sub-title {
        line-height: 1.7;
        font-size: 1rem;
        font-weight: 300;
        width: 100%;
        text-align: center;
      }

      .divider {
        width: 100%;
      }

      .container {
        display: flex;
        flex-direction: column;
      }

      .upload-button {
        margin: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(private modelService: ModelService, private router: Router) {}

  fileUploaded(file: File) {
    this.modelService.loadModel(file);
    this.router.navigate(['/options']);
  }
}
