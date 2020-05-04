import { Component } from '@angular/core';

@Component({
  selector: 'xai-data-metrics',
  template: `
    <div>
      <p>Data metrics will go here</p>
    </div>
  `,
  styles: [
    `
      div {
        height: 100%;
        display: flex;
      }

      p {
        margin: auto;
        border: 1px solid #f0f0f0;
        border-radius: 5px;
        padding: 10px;
      }
    `,
  ],
})
export class DataMetricsComponent {}
