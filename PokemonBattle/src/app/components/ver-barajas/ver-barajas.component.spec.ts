import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerBarajasComponent } from './ver-barajas.component';

describe('VerBarajasComponent', () => {
  let component: VerBarajasComponent;
  let fixture: ComponentFixture<VerBarajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerBarajasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerBarajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
