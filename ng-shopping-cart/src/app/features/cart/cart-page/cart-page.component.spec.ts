import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { CartPageComponent } from './cart-page.component';
import { CartService } from '../../../shared/services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem } from '../../../shared/types';
import { Product } from '../../../shared/types';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CartPageComponent', () => {
  let component: CartPageComponent;
  let fixture: ComponentFixture<CartPageComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 100 },
  };

  const mockCartItem: CartItem = {
    product: mockProduct,
    quantity: 2,
  };

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', [
      'cartItems$',
      'getTotal',
      'updateQuantity',
      'removeFromCart',
      'clearCart',
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [CartPageComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA], // For child components
    }).compileComponents();

    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // Setup mock observables
    cartService.cartItems$ = of([mockCartItem]);
    cartService.getTotal.and.returnValue(200);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with cart items and total', () => {
    expect(component.cartItems.length).toBe(1);
    expect(component.total).toBe(200);
  });

  it('should display empty cart message when no items', fakeAsync(() => {
    cartService.cartItems$ = of([]);
    component.ngOnInit();
    fixture.detectChanges();
    tick();

    const emptyCart = fixture.nativeElement.querySelector('.empty-cart');
    expect(emptyCart).toBeTruthy();
  }));

  it('should display cart items when available', () => {
    const cartItems = fixture.nativeElement.querySelectorAll('.cart-item');
    expect(cartItems.length).toBe(1);
  });

  it('should update quantity when valid input', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = '3';
    input.dispatchEvent(new Event('change'));

    expect(cartService.updateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('should remove item when quantity < 1', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = '0';
    input.dispatchEvent(new Event('change'));

    expect(cartService.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should show snackbar when quantity > 10', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = '11';
    input.dispatchEvent(new Event('change'));

    expect(snackBar.open).toHaveBeenCalledWith(
      'Maximum 10 units allowed per product',
      'OK',
      { duration: 3000, panelClass: ['error-snackbar'] }
    );
    expect(input.value).toBe('10');
  });

  it('should remove item when remove button clicked', () => {
    const removeBtn = fixture.nativeElement.querySelector('.remove-item-btn');
    removeBtn.click();

    expect(cartService.removeFromCart).toHaveBeenCalledWith(1);
  });

  it('should clear cart when clear button clicked', () => {
    const clearBtn = fixture.nativeElement.querySelector('.clear-cart-btn');
    clearBtn.click();

    expect(cartService.clearCart).toHaveBeenCalled();
  });

  it('should close dialog when close button clicked', () => {
    const closeBtn = fixture.nativeElement.querySelector('i-tabler[name="x"]');
    closeBtn.click();

    expect(dialog.closeAll).toHaveBeenCalled();
  });

  it('should calculate and display subtotal correctly', () => {
    const subtotal = fixture.nativeElement.querySelector('.item-total');
    expect(subtotal.textContent).toContain('$200.00');
  });

  it('should display total correctly', () => {
    const total = fixture.nativeElement.querySelector('.product-price');
    expect(total.textContent).toContain('$200.00');
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.cartSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.cartSubscription.unsubscribe).toHaveBeenCalled();
  });
});
