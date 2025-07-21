import { Test, TestingModule } from '@nestjs/testing';
import { SheduleSlotService } from './shedule-slot.service';

describe('SheduleSlotService', () => {
  let service: SheduleSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SheduleSlotService],
    }).compile();

    service = module.get<SheduleSlotService>(SheduleSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
