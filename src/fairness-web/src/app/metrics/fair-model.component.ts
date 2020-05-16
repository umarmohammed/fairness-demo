import { Component } from '@angular/core';

@Component({
  selector: 'fai-fair-model',
  template: `<div class="metrics">
    <nav mat-tab-nav-bar>
      <a
        mat-tab-link
        routerLink="metrics"
        routerLinkActive
        #rla="routerLinkActive"
        [active]="rla.isActive"
      >
        Metrics
      </a>
      <a
        mat-tab-link
        routerLink="compare"
        routerLinkActive
        #rla1="routerLinkActive"
        [active]="rla1.isActive"
      >
        Compare
      </a>
    </nav>
    <div style="height: calc(100% - 49px)">
      <router-outlet></router-outlet>
    </div>
  </div> `,
  styles: [
    `
      :host {
        background: #fdfdfd;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
})
export class FairModelComponent {}
