import { TestBed } from '@angular/core/testing';

import { TwelvedataService } from './twelvedata.service';

describe('TwelvedataService', () => {
  let service: TwelvedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwelvedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
