import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenQRComponent } from './gen-qr.component';

describe('GenQRComponent', () => {
  let component: GenQRComponent;
  let fixture: ComponentFixture<GenQRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenQRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
