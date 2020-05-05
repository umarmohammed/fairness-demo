import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ComboChartComponent } from './combo-chart.component';
import { ComboSeriesVerticalComponent } from './combo-series-vertical.component';
import { ComboBarLabelComponent } from './combo-bar-label.component';

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
