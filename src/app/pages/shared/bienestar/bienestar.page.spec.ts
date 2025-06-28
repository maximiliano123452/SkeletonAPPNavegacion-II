import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BienestarPage } from './bienestar.page';

describe('BienestarPage', () => {
  let component: BienestarPage;
  let fixture: ComponentFixture<BienestarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BienestarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
