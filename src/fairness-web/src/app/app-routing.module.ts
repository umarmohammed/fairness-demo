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
        path: 'metrics',
        loadChildren: () =>
          import('./metrics/metrics.module').then((m) => m.MetricsModule),
        canLoad: [ModelLoadedGuard],
      },
      {
        path: 'options',
        loadChildren: () =>
          import('./options/options.module').then((m) => m.OptionsModule),
        canLoad: [ModelLoadedGuard],
      },
      {
        path: '',
        redirectTo: 'options',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
