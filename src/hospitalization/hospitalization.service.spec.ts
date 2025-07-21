import { Test, TestingModule } from '@nestjs/testing';
import { HospitalizationService } from './hospitalization.service';

describe('HospitalizationService', () => {
  let service: HospitalizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalizationService],
    }).compile();

    service = module.get<HospitalizationService>(HospitalizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
