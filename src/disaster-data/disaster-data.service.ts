import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DisasterDataService {
  constructor(private readonly redisService: RedisService) {}
}
