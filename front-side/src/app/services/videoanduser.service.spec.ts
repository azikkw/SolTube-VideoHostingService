import { TestBed } from '@angular/core/testing';

import { VideoanduserService } from './videoanduser.service';

describe('VideoanduserService', () => {
  let service: VideoanduserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoanduserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
