import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetricsComponent } from './metrics.component';
import { ModelMetricsComponent } from './model-metrics.component';
import { DataMetricsComponent } from './data-metrics.component';
import { FooComponent } from './foo.component';
import { TradeOffComponent } from './trade-off.component';

const routes: Routes = [
  {
    path: '',
    component: MetricsComponent,
    children: [
      {
        path: 'model',
        component: ModelMetricsComponent,
        children: [
          { path: 'foo', component: FooComponent },
          { path: 'trade-offs', component: TradeOffComponent },
          { path: '', redirectTo: 'foo', pathMatch: 'full' },
        ],
      },
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
