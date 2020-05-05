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
          class="m-l-20"
          color="primary"
          mat-flat-button
          [disabled]="!(selectedFeatures$ | async)"
        >
          fix
          <mat-icon>filter_center_focus</mat-icon>
        </button>
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

      .m-l-20 {
        margin-left: 20px;
      }

      .nav-menu {
        visibility: hidden;
      }

      .nav-menu.show {
        visibility: visible;
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
