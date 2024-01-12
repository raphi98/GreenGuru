import { TestBed } from '@angular/core/testing';

import { PlantAPIService } from './plant-api.service';

describe('PlantAPIService', () => {
  let service: PlantAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
