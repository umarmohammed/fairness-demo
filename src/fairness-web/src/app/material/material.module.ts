import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const matModules = [
  MatToolbarModule,
  MatButtonModule,
  MatSelectModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [...matModules],
  exports: [...matModules],
})
export class MaterialModule {}
