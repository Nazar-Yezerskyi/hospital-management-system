import { Test, TestingModule } from '@nestjs/testing';
import { MedicineWriteOffController } from './medicine-write-off.controller';

describe('MedicineWriteOffController', () => {
  let controller: MedicineWriteOffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineWriteOffController],
    }).compile();

    controller = module.get<MedicineWriteOffController>(MedicineWriteOffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
