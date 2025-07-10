import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { NgmaterialModule } from '../../ngmaterial.module';
import { SharedModule } from '../../shared/shared.module';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  declarations: [ProductsComponent, ProductListComponent, ProductCardComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    NgmaterialModule,
    StarRatingModule.forRoot(),
  ],
})
export class ProductsModule {}
