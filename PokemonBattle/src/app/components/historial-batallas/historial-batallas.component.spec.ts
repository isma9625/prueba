import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialBatallasComponent } from './historial-batallas.component';

describe('HistorialBatallasComponent', () => {
  let component: HistorialBatallasComponent;
  let fixture: ComponentFixture<HistorialBatallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialBatallasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialBatallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
