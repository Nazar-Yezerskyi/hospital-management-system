import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRequestService } from './employee-request.service';

describe('EmployeeRequestService', () => {
  let service: EmployeeRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeRequestService],
    }).compile();

    service = module.get<EmployeeRequestService>(EmployeeRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
