import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { Repository } from 'typeorm';
import { CreateRegionDto } from './dto/create-regions.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async create(createRegionDto: CreateRegionDto) {
    const region = this.regionRepository.create(createRegionDto);
    return this.regionRepository.save(region);
  }
}
