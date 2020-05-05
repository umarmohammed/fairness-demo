import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ComboChartComponent } from './combo-chart/combo-chart.component';
import { ComboSeriesVerticalComponent } from './combo-chart/combo-series-vertical.component';
import { ComboBarLabelComponent } from './combo-chart/combo-bar-label.component';

@NgModule({
  imports: [NgxChartsModule],
  declarations: [
    ComboChartComponent,
    ComboSeriesVerticalComponent,
    ComboBarLabelComponent,
  ],
  exports: [NgxChartsModule, ComboChartComponent],
})
export class ChartsModule {}
