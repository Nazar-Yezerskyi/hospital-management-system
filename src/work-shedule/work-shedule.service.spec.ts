import { Test, TestingModule } from '@nestjs/testing';
import { WorkSheduleService } from './work-shedule.service';

describe('WorkSheduleService', () => {
  let service: WorkSheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkSheduleService],
    }).compile();

    service = module.get<WorkSheduleService>(WorkSheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
