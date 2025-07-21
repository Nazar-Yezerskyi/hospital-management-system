import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRequestController } from './employee-request.controller';

describe('EmployeeRequestController', () => {
  let controller: EmployeeRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeRequestController],
    }).compile();

    controller = module.get<EmployeeRequestController>(EmployeeRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
