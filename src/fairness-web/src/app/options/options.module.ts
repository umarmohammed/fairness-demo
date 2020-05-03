import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { OptionsComponent } from './options.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SelectProtectedFeatureComponent } from './select-protected-feature.component';

const routes: Routes = [{ path: '', component: OptionsComponent }];

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)],
  declarations: [OptionsComponent, SelectProtectedFeatureComponent],
})
export class OptionsModule {}
