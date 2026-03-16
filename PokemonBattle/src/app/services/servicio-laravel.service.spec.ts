import { TestBed } from '@angular/core/testing';
import { ServicioLaravelService } from './servicio-laravel.service';

describe('ServicioLaravelService', () => {
  let service: ServicioLaravelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioLaravelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
