import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FeaturesService } from './features.service';
import { ShellService } from './shell.service';
import { SideNavService } from './side-nav.service';
import { FixService } from './fix.service';

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
          [disabled]="!(canFix$ | async)"
          [class.hidden]="fixing$ | async"
          (click)="onFixClick()"
        >
          Fix
        </button>
        <mat-spinner
          class="m-l-50"
          *ngIf="fixing$ | async"
          [diameter]="30"
        ></mat-spinner>
        <fai-title class="title"></fai-title>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item>
            <mat-icon>vertical_align_bottom</mat-icon>Download Model
          </button>
          <button mat-menu-item>
            <mat-icon>file_copy</mat-icon>Export Report
          </button>
          <button mat-menu-item>
            <mat-icon>cloud_cirlce</mat-icon>Generate API
          </button>
        </mat-menu>
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
      .hidden {
        display: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  selectedFeatures$ = this.featuresService.selectedFeatures$;
  canFix$ = this.featuresService.canFix$;
  showMenu$ = this.shellService.showMenu$;
  fixing$ = this.fixService.fixing$;

  constructor(
    private featuresService: FeaturesService,
    private shellService: ShellService,
    private sideNavService: SideNavService,
    private fixService: FixService
  ) {}

  onMenuClicked() {
    this.sideNavService.toggle();
    this.triggerWindowChangeForCharts();
  }

  onFixClick() {
    this.fixService.fix();
  }

  triggerWindowChangeForCharts() {
    window.dispatchEvent(new Event('resize'));
  }
}
