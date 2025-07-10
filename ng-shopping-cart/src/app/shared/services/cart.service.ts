import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private snackBar: MatSnackBar) {}

  addToCart(product: any): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      if (existingItem.quantity == 10) {
        this.snackBar.open('Maximum 10 units allowed per product', 'OK', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      } else {
        existingItem.quantity += 1;
      }
    } else {
      currentItems.push({ product, quantity: 1 });
    }

    this.cartItemsSubject.next([...currentItems]);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(
      (item) => item.product.id !== productId
    );
    this.cartItemsSubject.next([...currentItems]);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const itemToUpdate = currentItems.find(
      (item) => item.product.id === productId
    );

    if (itemToUpdate) {
      itemToUpdate.quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }
}
