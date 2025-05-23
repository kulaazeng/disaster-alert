import { Injectable } from '@nestjs/common';

@Injectable()
export class DisasterRisksService {
  constructor() {}

  async getAllDisasterRisks(): Promise<any[]> {
    return [];
  }
}
