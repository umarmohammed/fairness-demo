import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { ShellComponent } from './shell.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleComponent } from './title-component';

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [ShellComponent, TitleComponent],
})
export class CoreModule {}
