import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { CartPageComponent } from '../../../features/cart/cart-page/cart-page.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  cartItemCount$!: Observable<number>;
  cartCount: number = 0;
  countSubscription!: Subscription;

  constructor(private cartService: CartService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.cartItemCount$ = this.cartService.cartItems$.pipe(
      map((items) => items.reduce((count, item) => count + item.quantity, 0))
    );

    this.countSubscription = this.cartItemCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }

  openCartDialog(): void {
    let dialogRef = this.dialog.open(CartPageComponent, {
      width: '40%',
      height: '100%',
      position: {
        top: '0',
        right: '100',
        bottom: '0',
      },
      autoFocus: true,
      direction: 'ltr',
      // data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  ngOnDestroy() {
    this.countSubscription.unsubscribe();
  }
}
