import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRManagerComponent } from './qr-manager.component';

describe('QRManagerComponent', () => {
  let component: QRManagerComponent;
  let fixture: ComponentFixture<QRManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QRManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QRManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
