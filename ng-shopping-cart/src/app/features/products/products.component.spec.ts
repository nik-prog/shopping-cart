import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Product } from '../../shared/types';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductService } from '../../shared/services/product.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 100,
      description: 'Description',
      category: 'Category',
      image: 'image.jpg',
      rating: { rate: 4.5, count: 100 },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    spyOn(productService, 'getProducts').and.returnValue(of(mockProducts));
    component.ngOnInit();

    expect(component.isLoading).toBeFalse();
    expect(component.products).toEqual(mockProducts);
    expect(component.error).toBeNull();
  });

  it('should handle error when loading products', () => {
    const errorMessage = 'Error loading products';
    spyOn(productService, 'getProducts').and.returnValue(
      throwError(() => new Error(errorMessage))
    );
    component.ngOnInit();

    expect(component.isLoading).toBeFalse();
    expect(component.products).toEqual([]);
    expect(component.error).toBe(
      'Failed to load products. Please try again later.'
    );
  });
});
