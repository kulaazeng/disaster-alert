import { Module } from '@nestjs/common';
import { DisasterDataService } from './disaster-data.service';

@Module({
  providers: [DisasterDataService],
})
export class DisasterDataModule {}
