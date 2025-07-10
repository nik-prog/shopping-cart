import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { Product } from '../../../shared/types';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductCardComponent } from '../product-card/product-card.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 109.95,
      description: 'Test Description 1',
      category: 'category1',
      image: 'image1.jpg',
      rating: { rate: 4.1, count: 120 },
    },
    {
      id: 2,
      title: 'Product 2',
      price: 22.99,
      description: 'Test Description 2',
      category: 'category2',
      image: 'image2.jpg',
      rating: { rate: 3.9, count: 89 },
    },
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
    ]);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent, ProductCardComponent],
      imports: [MatProgressSpinnerModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignores child components if needed
    }).compileComponents();

    productService = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    productService.getProducts.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
  });

  it('should load products successfully', fakeAsync(() => {
    productService.getProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();
    tick();

    expect(component.products.length).toBe(2);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  }));

  it('should handle error when loading products', fakeAsync(() => {
    const errorMessage = 'Test error';
    productService.getProducts.and.returnValue(
      throwError(() => new Error(errorMessage))
    );
    fixture.detectChanges();
    tick();

    expect(component.error).toBe(
      'Failed to load products. Please try again later.'
    );
    expect(component.isLoading).toBeFalse();
    expect(toastr.error).toHaveBeenCalledWith(
      'Failed to load products. Please try again later.',
      'Error'
    );
  }));

  it('should display loading spinner when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should display error message when error occurs', () => {
    component.error = 'Test error';
    fixture.detectChanges();
    const errorDiv = fixture.nativeElement.querySelector('.error');
    expect(errorDiv.textContent).toContain('Test error');
  });

  it('should display product cards when data is loaded', () => {
    component.products = mockProducts;
    component.isLoading = false;
    fixture.detectChanges();

    const productCards =
      fixture.nativeElement.querySelectorAll('app-product-card');
    expect(productCards.length).toBe(1); // Single card component handles all products
  });

  it('should unsubscribe on destroy', () => {
    const mockSubscription = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    component.getProdsSubscription = mockSubscription;

    component.ngOnDestroy();
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should pass products data to product-card component', () => {
    component.products = mockProducts;
    component.isLoading = false;
    fixture.detectChanges();

    const productCard = fixture.debugElement.children[0].componentInstance;
    expect(productCard.data).toEqual(mockProducts);
  });
});
