import { Test, TestingModule } from '@nestjs/testing';
import { WardPlaceService } from './ward-place.service';

describe('WardPlaceService', () => {
  let service: WardPlaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WardPlaceService],
    }).compile();

    service = module.get<WardPlaceService>(WardPlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
