import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ComboChartComponent } from './combo-chart/combo-chart.component';
import { ComboSeriesVerticalComponent } from './combo-chart/combo-series-vertical.component';
import { ComboBarLabelComponent } from './combo-chart/combo-bar-label.component';
import { CustomBarVerticalComponent } from './custom-vertical-bar/custom-bar-vertical.component';
import { CustomSeriesVerticalComponent } from './custom-vertical-bar/custom-series-vertical.component';
import { CustomBarVertical2DComponent } from './custom-bar-vertical-2d/custom-bar-vertical-2d.component';
import { CustomBubbleSeriesComponent } from './custom-bubble-chart/custom-bubble-series.component';
import { CustomBubbleChartComponent } from './custom-bubble-chart/custom-bubble-chart.component';
import { BubbleCircleComponent } from './custom-bubble-chart/bubble-circle.component';

@NgModule({
  imports: [NgxChartsModule],
  declarations: [
    ComboChartComponent,
    ComboSeriesVerticalComponent,
    ComboBarLabelComponent,
    CustomBarVerticalComponent,
    CustomSeriesVerticalComponent,
    CustomBarVertical2DComponent,
    CustomBubbleSeriesComponent,
    CustomBubbleChartComponent,
    BubbleCircleComponent,
  ],
  exports: [
    NgxChartsModule,
    ComboChartComponent,
    CustomBarVerticalComponent,
    CustomBarVertical2DComponent,
    CustomBubbleChartComponent,
  ],
})
export class ChartsModule {}
