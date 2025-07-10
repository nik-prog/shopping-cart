import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../types';

describe('CartService', () => {
  let service: CartService;
  const mockProduct: Product = {
    id: 1,
    title: 'Product 1',
    price: 100,
    description: 'Description',
    category: 'Category',
    image: 'image.jpg',
    rating: { rate: 4.5, count: 100 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {
    service.addToCart(mockProduct);
    service.cartItems$.subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].product).toEqual(mockProduct);
      expect(items[0].quantity).toBe(1);
    });
  });

  it('should increment quantity when adding same product', () => {
    service.addToCart(mockProduct);
    service.addToCart(mockProduct);

    service.cartItems$.subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should remove product from cart', () => {
    service.addToCart(mockProduct);
    service.removeFromCart(mockProduct.id);

    service.cartItems$.subscribe((items) => {
      expect(items.length).toBe(0);
    });
  });

  it('should update product quantity', () => {
    service.addToCart(mockProduct);
    service.updateQuantity(mockProduct.id, 5);

    service.cartItems$.subscribe((items) => {
      expect(items[0].quantity).toBe(5);
    });
  });

  it('should calculate total correctly', () => {
    service.addToCart(mockProduct);
    service.addToCart({ ...mockProduct, id: 2, price: 200 });

    expect(service.getTotal()).toBe(300);
  });

  it('should clear cart', () => {
    service.addToCart(mockProduct);
    service.clearCart();

    service.cartItems$.subscribe((items) => {
      expect(items.length).toBe(0);
    });
  });
});
