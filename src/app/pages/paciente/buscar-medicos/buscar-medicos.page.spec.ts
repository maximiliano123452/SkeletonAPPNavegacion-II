import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscarMedicosPage } from './buscar-medicos.page';

describe('BuscarMedicosPage', () => {
  let component: BuscarMedicosPage;
  let fixture: ComponentFixture<BuscarMedicosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarMedicosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
