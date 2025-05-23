import { Test, TestingModule } from '@nestjs/testing';
import { AlertSettingsController } from './alert-settings.controller';

describe('AlertSettingsController', () => {
  let controller: AlertSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertSettingsController],
    }).compile();

    controller = module.get<AlertSettingsController>(AlertSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
