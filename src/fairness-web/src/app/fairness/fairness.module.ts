import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FairnessComponent } from './fairness.component';
import { FairnessRoutingModule } from './fairness-routing.module';

@NgModule({
  imports: [CommonModule, MaterialModule, FairnessRoutingModule],
  declarations: [FairnessComponent],
})
export class FairnessModule {}
