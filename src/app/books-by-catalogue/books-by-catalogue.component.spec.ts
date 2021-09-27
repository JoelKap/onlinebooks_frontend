import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksByCatalogueComponent } from './books-by-catalogue.component';

describe('BooksByCatalogueComponent', () => {
  let component: BooksByCatalogueComponent;
  let fixture: ComponentFixture<BooksByCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooksByCatalogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksByCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
