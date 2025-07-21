import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentNotesService } from './appointment-notes.service';

describe('AppointmentNotesService', () => {
  let service: AppointmentNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentNotesService],
    }).compile();

    service = module.get<AppointmentNotesService>(AppointmentNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
