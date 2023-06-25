import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenQRBankComponent } from './gen-qrbank.component';

describe('GenQRBankComponent', () => {
  let component: GenQRBankComponent;
  let fixture: ComponentFixture<GenQRBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenQRBankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenQRBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
