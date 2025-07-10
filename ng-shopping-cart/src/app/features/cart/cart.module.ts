import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { NgmaterialModule } from '../../ngmaterial.module';
import { IconsModule } from '../../icons.module';

@NgModule({
  declarations: [CartComponent, CartPageComponent],
  imports: [CommonModule, CartRoutingModule, IconsModule, NgmaterialModule],
})
export class CartModule {}
