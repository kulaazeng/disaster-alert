import { Test, TestingModule } from '@nestjs/testing';
import { DisasterRisksController } from './disaster-risks.controller';

describe('DisasterRisksController', () => {
  let controller: DisasterRisksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisasterRisksController],
    }).compile();

    controller = module.get<DisasterRisksController>(DisasterRisksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
