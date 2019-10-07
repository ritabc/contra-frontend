import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from './api.service';

import { UpdateMovesService } from './update-moves.service';

describe('UpdateMovesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UpdateMovesService, ApiService]
    });
  });

  it('should be created', inject([UpdateMovesService], (service: UpdateMovesService) => {
    expect(service).toBeTruthy();
  }));
});
