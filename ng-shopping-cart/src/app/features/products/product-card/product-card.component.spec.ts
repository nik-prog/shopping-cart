import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StarRatingModule } from 'angular-star-rating';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../shared/services/cart.service';
import { Product } from '../../../shared/types';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let cartService: jasmine.SpyObj<CartService>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 109.95,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg',
    rating: {
      rate: 4.5,
      count: 120,
    },
  };

  beforeEach(async () => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);

    await TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      imports: [MatCardModule, MatButtonModule, StarRatingModule],
      providers: [
        CurrencyPipe,
        { provide: CartService, useValue: cartServiceSpy },
      ],
    }).compileComponents();

    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.data = [mockProduct]; // Assign input data
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-card-title').textContent).toContain(
      mockProduct.title
    );
  });

  it('should display product category', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-card-subtitle').textContent).toContain(
      mockProduct.category
    );
  });

  it('should display product price with currency', () => {
    const compiled = fixture.nativeElement;
    const priceElement = compiled.querySelector('.product-price');
    expect(priceElement.textContent).toContain('$109.95');
  });

  it('should display product rating', () => {
    const compiled = fixture.nativeElement;
    const ratingCount = compiled.querySelector(
      '.product-rating div:last-child'
    );
    expect(ratingCount.textContent).toContain('(120)');
  });

  it('should display product image with correct src and alt', () => {
    const compiled = fixture.nativeElement;
    const imgElement = compiled.querySelector('.product-image');
    expect(imgElement.src).toContain('test.jpg');
    expect(imgElement.alt).toBe('Test Product');
  });

  it('should call addToCart when button is clicked', () => {
    const addButton = fixture.nativeElement.querySelector('.add-to-cart-btn');
    addButton.click();

    expect(cartService.addToCart).toHaveBeenCalledTimes(1);
    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should render star rating component', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('star-rating')).toBeTruthy();
  });

  it('should pass correct rating to star-rating component', () => {
    const starRating = fixture.nativeElement.querySelector('star-rating');
    expect(starRating.getAttribute('rating')).toBe('4.5');
    expect(starRating.getAttribute('showHalfStars')).toBe('true');
  });

  it('should handle empty data input', () => {
    component.data = [];
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBe(0);
  });
});
