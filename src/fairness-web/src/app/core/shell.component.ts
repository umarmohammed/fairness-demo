import { Component } from '@angular/core';

@Component({
  selector: 'fai-shell',
  template: `
    <mat-toolbar>
      <mat-toolbar-row>
        <a mat-button routerLink="/home">Fairness Demo</a>
      </mat-toolbar-row>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
})
export class ShellComponent {}
