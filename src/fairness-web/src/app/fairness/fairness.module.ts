import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FairnessComponent } from './fairness.component';
import { FairnessRoutingModule } from './fairness-routing.module';
import { SelectProtectedFeatureComponent } from './select-protected-feature.component';
import { ProtectedFeaturesComponent } from './protected-features.component';
import { MetricsComponent } from './metrics.component';

@NgModule({
  imports: [CommonModule, MaterialModule, FairnessRoutingModule],
  declarations: [
    FairnessComponent,
    SelectProtectedFeatureComponent,
    ProtectedFeaturesComponent,
    MetricsComponent,
  ],
})
export class FairnessModule {}
