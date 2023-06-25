import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyQRComponent } from './my-qr.component';

describe('MyQRComponent', () => {
  let component: MyQRComponent;
  let fixture: ComponentFixture<MyQRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyQRComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
