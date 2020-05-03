import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FairnessComponent } from './fairness.component';
import { FairnessRoutingModule } from './fairness-routing.module';
import { SelectProtectedFeatureComponent } from './select-protected-feature.component';
import { ProtectedFeaturesComponent } from './protected-features.component';
import { MetricsComponent } from './metrics.component';
import { PerformanceChartComponent } from './performance-chart.component';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { FairnessChartComponent } from './fairness-chart.component';
import { ThresholdSliderComponent } from './threshold-slider.component';
import { ChartsModule } from '../charts/charts.module';

@NgModule({
  imports: [CommonModule, MaterialModule, FairnessRoutingModule, ChartsModule],
  declarations: [
    FairnessComponent,
    SelectProtectedFeatureComponent,
    ProtectedFeaturesComponent,
    MetricsComponent,
    PerformanceChartComponent,
    ChartWrapperComponent,
    FairnessChartComponent,
    ThresholdSliderComponent,
  ],
})
export class FairnessModule {}
