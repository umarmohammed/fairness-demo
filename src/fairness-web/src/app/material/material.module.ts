import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';

const matModules = [
  MatToolbarModule,
  MatButtonModule,
  MatSelectModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatSliderModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatRadioModule,
  MatTabsModule,
];

@NgModule({
  imports: [...matModules],
  exports: [...matModules],
})
export class MaterialModule {}
