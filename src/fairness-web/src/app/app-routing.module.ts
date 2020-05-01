import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShellComponent } from './core/shell.component';
import { ModelLoadedGuard } from './core/model-loaded.guard';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'fairness',
        loadChildren: () =>
          import('./fairness/fairness.module').then((m) => m.FairnessModule),
        canLoad: [ModelLoadedGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
