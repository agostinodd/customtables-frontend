import { TestBed, async, inject } from '@angular/core/testing';

import { BaseDataGuard } from './base-data.guard';

describe('BaseDataGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseDataGuard]
    });
  });

  it('should ...', inject([BaseDataGuard], (guard: BaseDataGuard) => {
    expect(guard).toBeTruthy();
  }));
});
