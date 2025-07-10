import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../shared/types';
import { ProductService } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  product!: Product;
  @Input() data!: Product[];

  constructor(
    private productService: ProductService,
    private cartService: CartService // Inject CartService
  ) {}

  onAddToCartProduct(product: Product): void {
    this.cartService.addToCart(product);
  }
}
