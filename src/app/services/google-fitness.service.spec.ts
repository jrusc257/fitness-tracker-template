import { TestBed } from '@angular/core/testing';

import { GoogleFitnessService } from './google-fitness.service';

describe('GoogleFitnessService', () => {
  let service: GoogleFitnessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleFitnessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
