import { Component } from '@angular/core';
import { FeaturesService } from './features.service';
import { ShellService } from './shell.service';
import { SideNavService } from './side-nav.service';

@Component({
  selector: 'fai-shell',
  template: `
    <mat-toolbar>
      <mat-toolbar-row>
        <button
          mat-icon-button
          [class.show]="showMenu$ | async"
          class="nav-menu"
          (click)="onMenuClicked()"
        >
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
          class="m-l-50"
          color="primary"
          mat-flat-button
          [disabled]="!(selectedFeatures$ | async)"
        >
          fix
        </button>
        <fai-title class="title"></fai-title>
        <a href="https://www.netlify.com">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"
            alt="Deploys by Netlify"
          />
        </a>
      </mat-toolbar-row>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      a.active {
        color: #3f51b5;
      }

      ::ng-deep a.active span.mat-button-wrapper {
        border-bottom: 2px solid #3f51b5;
      }

      .m-l-50 {
        margin-left: 50px;
      }

      .nav-menu {
        visibility: hidden;
      }

      .nav-menu.show {
        visibility: visible;
      }

      .fix-icon {
        font-size: 22px;
      }

      .title {
        flex: 1 1 auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
      }
    `,
  ],
})
export class ShellComponent {
  selectedFeatures$ = this.featuresService.selectedFeatures$;
  showMenu$ = this.shellService.showMenu$;

  constructor(
    private featuresService: FeaturesService,
    private shellService: ShellService,
    private sideNavService: SideNavService
  ) {}

  onMenuClicked() {
    this.sideNavService.toggle();
    this.triggerWindowChangeForCharts();
  }

  triggerWindowChangeForCharts() {
    window.dispatchEvent(new Event('resize'));
  }
}
