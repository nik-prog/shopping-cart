import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/types';
import { ProductService } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  error: string | null = null;
  getProdsSubscription!: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProdsSubscription = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  ngOnDestroy() {
    this.getProdsSubscription.unsubscribe();
  }
}
