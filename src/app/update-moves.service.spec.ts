import { TestBed, inject } from '@angular/core/testing';

import { UpdateMovesService } from './update-moves.service';

describe('UpdateMovesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateMovesService]
    });
  });

  it('should be created', inject([UpdateMovesService], (service: UpdateMovesService) => {
    expect(service).toBeTruthy();
  }));
});
