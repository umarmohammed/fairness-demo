import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { SelectProtectedFeatureComponent } from './select-protected-feature.component';
import { MetricsComponent } from './metrics.component';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { FairnessChartComponent } from './fairness-chart.component';
import { ThresholdSliderComponent } from './threshold-slider.component';
import { ChartsModule } from '../charts/charts.module';
import { MetricsRoutingModule } from './metrics-routing.module';
import { ModelMetricsComponent } from './model-metrics.component';
import { DataMetricsComponent } from './data-metrics.component';
import { ScatterChartComponent } from './scatter-chart.component';
import { PerformanceChartComponent } from './performance-chart.component';
import { FooComponent } from './foo.component';
import { TradeOffComponent } from './trade-off.component';

@NgModule({
  imports: [CommonModule, MaterialModule, MetricsRoutingModule, ChartsModule],
  declarations: [
    SelectProtectedFeatureComponent,
    MetricsComponent,
    ChartWrapperComponent,
    FairnessChartComponent,
    ThresholdSliderComponent,
    ModelMetricsComponent,
    DataMetricsComponent,
    ScatterChartComponent,
    PerformanceChartComponent,
    FooComponent,
    TradeOffComponent,
  ],
})
export class MetricsModule {}
