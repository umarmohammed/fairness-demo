import { Component } from '@angular/core';
import { FeaturesService } from './features.service';
import { ShellService } from './shell.service';

@Component({
  selector: 'fai-shell',
  template: `
    <mat-toolbar>
      <mat-toolbar-row>
        <button mat-icon-button *ngIf="showMenu$ | async">
          <mat-icon>menu</mat-icon>
        </button>
        <a mat-button routerLink="/home">Fairness Demo</a>
        <a mat-button routerLinkActive="active" routerLink="/options"
          >Options</a
        >
        <a
          mat-button
          routerLinkActive="active"
          routerLink="/metrics"
          [disabled]="!(selectedFeatures$ | async)"
          >Metrics</a
        >
        <button
          class="m-l-20"
          color="primary"
          mat-flat-button
          [disabled]="!(selectedFeatures$ | async)"
        >
          fix
        </button>
      </mat-toolbar-row>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      a.active {
        background: hsla(0, 0%, 100%, 0.65);
      }

      .m-l-20 {
        margin-left: 20px;
      }
    `,
  ],
})
export class ShellComponent {
  selectedFeatures$ = this.featuresService.selectedFeatures$;
  showMenu$ = this.shellService.showMenu$;

  constructor(
    private featuresService: FeaturesService,
    private shellService: ShellService
  ) {}
}
