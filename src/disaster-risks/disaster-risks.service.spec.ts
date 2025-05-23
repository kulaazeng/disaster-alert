import { Test, TestingModule } from '@nestjs/testing';
import { DisasterRisksService } from './disaster-risks.service';

describe('DisasterRisksService', () => {
  let service: DisasterRisksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisasterRisksService],
    }).compile();

    service = module.get<DisasterRisksService>(DisasterRisksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
