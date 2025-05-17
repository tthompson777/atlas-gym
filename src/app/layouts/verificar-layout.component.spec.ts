import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarLayoutComponent } from './verificar-layout.component';

describe('VerificarLayoutComponent', () => {
  let component: VerificarLayoutComponent;
  let fixture: ComponentFixture<VerificarLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
