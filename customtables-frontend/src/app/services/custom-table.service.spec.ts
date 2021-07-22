import { TestBed } from '@angular/core/testing';

import { CustomTableService } from './custom-table.service';
import {CustomTable} from '../Models/custom-table';

describe('StammdatenTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomTableService = TestBed.get(CustomTableService);
    expect(service).toBeTruthy();
  });

  it('should save a stammdatenTable', () =>{
    const service: CustomTableService = TestBed.get(CustomTableService);
    const able: CustomTable = {ownerMail: '', customData: undefined, customSchema: undefined};
  });
});
