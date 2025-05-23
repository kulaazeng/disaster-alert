import { Test, TestingModule } from '@nestjs/testing';
import { DisasterDataService } from './disaster-data.service';

describe('DisasterDataService', () => {
  let service: DisasterDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisasterDataService],
    }).compile();

    service = module.get<DisasterDataService>(DisasterDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
