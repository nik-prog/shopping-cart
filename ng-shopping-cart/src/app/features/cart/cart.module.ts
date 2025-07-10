import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { NgmaterialModule } from '../../ngmaterial.module';

@NgModule({
  declarations: [CartComponent, CartPageComponent],
  imports: [CommonModule, CartRoutingModule, NgmaterialModule],
})
export class CartModule {}
