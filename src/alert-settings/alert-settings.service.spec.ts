import { Test, TestingModule } from '@nestjs/testing';
import { AlertSettingsService } from './alert-settings.service';

describe('AlertSettingsService', () => {
  let service: AlertSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertSettingsService],
    }).compile();

    service = module.get<AlertSettingsService>(AlertSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
