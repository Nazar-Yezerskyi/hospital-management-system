import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentNotesController } from './appointment-notes.controller';

describe('AppointmentNotesController', () => {
  let controller: AppointmentNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentNotesController],
    }).compile();

    controller = module.get<AppointmentNotesController>(AppointmentNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
