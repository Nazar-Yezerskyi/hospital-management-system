import { Test, TestingModule } from '@nestjs/testing';
import { WorkSheduleController } from './work-shedule.controller';

describe('WorkSheduleController', () => {
  let controller: WorkSheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkSheduleController],
    }).compile();

    controller = module.get<WorkSheduleController>(WorkSheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
