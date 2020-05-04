import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetricsComponent } from './metrics.component';
import { ModelMetricsComponent } from './model-metrics.component';
import { DataMetricsComponent } from './data-metrics.component';

const routes: Routes = [
  {
    path: '',
    component: MetricsComponent,
    children: [
      { path: 'model', component: ModelMetricsComponent },
      { path: 'data', component: DataMetricsComponent },
      { path: '', redirectTo: 'model', pathMatch: 'full' },
      { path: '**', redirectTo: 'model' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetricsRoutingModule {}
