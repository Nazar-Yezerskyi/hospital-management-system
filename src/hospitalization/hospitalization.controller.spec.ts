import { Test, TestingModule } from '@nestjs/testing';
import { HospitalizationController } from './hospitalization.controller';

describe('HospitalizationController', () => {
  let controller: HospitalizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalizationController],
    }).compile();

    controller = module.get<HospitalizationController>(HospitalizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
