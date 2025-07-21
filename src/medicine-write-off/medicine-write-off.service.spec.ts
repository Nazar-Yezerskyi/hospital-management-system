import { Test, TestingModule } from '@nestjs/testing';
import { MedicineWriteOffService } from './medicine-write-off.service';

describe('MedicineWriteOffService', () => {
  let service: MedicineWriteOffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicineWriteOffService],
    }).compile();

    service = module.get<MedicineWriteOffService>(MedicineWriteOffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
