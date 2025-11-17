import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminZonas } from './admin-zonas';

describe('AdminZonas', () => {
  let component: AdminZonas;
  let fixture: ComponentFixture<AdminZonas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminZonas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminZonas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
