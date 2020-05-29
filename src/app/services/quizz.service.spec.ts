import { TestBed } from '@angular/core/testing';

import { QuizzService } from './quizz.service';

describe('QuizzService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuizzService = TestBed.get(QuizzService);
    expect(service).toBeTruthy();
  });
});
