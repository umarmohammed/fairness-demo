import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FairnessComponent } from './fairness.component';

const routes: Routes = [{ path: '', component: FairnessComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FairnessRoutingModule {}
