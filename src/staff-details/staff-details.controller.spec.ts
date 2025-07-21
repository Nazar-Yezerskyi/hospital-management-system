import { Test, TestingModule } from '@nestjs/testing';
import { StaffDetailsController } from './staff-details.controller';

describe('StaffDetailsController', () => {
  let controller: StaffDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffDetailsController],
    }).compile();

    controller = module.get<StaffDetailsController>(StaffDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
