import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { IconsModule } from '../icons.module';
import { NgmaterialModule } from '../ngmaterial.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, IconsModule, NgmaterialModule],
  exports: [
    HeaderComponent, // This makes it available to other modules
  ],
})
export class SharedModule {}
