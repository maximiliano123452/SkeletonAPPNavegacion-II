import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FarmaciasPage } from './farmacias.page';

describe('FarmaciasPage', () => {
  let component: FarmaciasPage;
  let fixture: ComponentFixture<FarmaciasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmaciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
