import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreAbiertoComponent } from './sobre-abierto.component';

describe('SobreAbiertoComponent', () => {
  let component: SobreAbiertoComponent;
  let fixture: ComponentFixture<SobreAbiertoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreAbiertoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreAbiertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
