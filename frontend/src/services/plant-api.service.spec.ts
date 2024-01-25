import { TestBed } from '@angular/core/testing';

import { ApiService } from './plant-api.service';

describe('PlantAPIService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
