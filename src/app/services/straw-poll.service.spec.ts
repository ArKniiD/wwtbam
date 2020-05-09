import { TestBed } from '@angular/core/testing';

import { StrawPollService } from './straw-poll.service';

describe('StrawPollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StrawPollService = TestBed.get(StrawPollService);
    expect(service).toBeTruthy();
  });
});
