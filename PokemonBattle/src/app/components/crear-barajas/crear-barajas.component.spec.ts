import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearBarajasComponent } from './crear-barajas.component';

describe('CrearBarajasComponent', () => {
  let component: CrearBarajasComponent;
  let fixture: ComponentFixture<CrearBarajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearBarajasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearBarajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
