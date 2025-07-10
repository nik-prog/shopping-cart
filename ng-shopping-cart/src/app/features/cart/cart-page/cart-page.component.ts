import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../../shared/types';
import { CartService } from '../../../shared/services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  cartSubscription!: Subscription;

  constructor(private cartService: CartService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  updateQuantity(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    if (quantity < 1) {
      this.cartService.removeFromCart(item.product.id);
    } else {
      this.cartService.updateQuantity(item.product.id, quantity);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
}
