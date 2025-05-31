import { TestBed } from '@angular/core/testing';

import { EmployeedataService } from './employeedata.service';

describe('EmployeedataService', () => {
  let service: EmployeedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
