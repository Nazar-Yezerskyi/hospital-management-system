import { Test, TestingModule } from '@nestjs/testing';
import { WardPlaceController } from './ward-place.controller';

describe('WardPlaceController', () => {
  let controller: WardPlaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WardPlaceController],
    }).compile();

    controller = module.get<WardPlaceController>(WardPlaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
