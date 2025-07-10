import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../../shared/types';
import { CartService } from '../../../shared/services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;
  cartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

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
    } else if (quantity > 10) {
      this.snackBar.open('Maximum 10 units allowed per product', 'OK', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      input.value = '10'; // Reset to max
      item.quantity = 10;
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
