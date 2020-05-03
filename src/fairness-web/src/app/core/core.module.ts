import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { ShellComponent } from './shell.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [ShellComponent],
})
export class CoreModule {}
