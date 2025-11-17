import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarReservas } from './listar-reservas';

describe('ListarReservas', () => {
  let component: ListarReservas;
  let fixture: ComponentFixture<ListarReservas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarReservas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarReservas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
