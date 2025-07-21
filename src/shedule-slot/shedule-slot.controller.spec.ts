import { Test, TestingModule } from '@nestjs/testing';
import { SheduleSlotController } from './shedule-slot.controller';

describe('SheduleSlotController', () => {
  let controller: SheduleSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SheduleSlotController],
    }).compile();

    controller = module.get<SheduleSlotController>(SheduleSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
