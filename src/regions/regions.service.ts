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
    const regionData = new Region();
    regionData.regionId = createRegionDto.regionId;
    regionData.latitude = createRegionDto.locationCoordinates.latitude;
    regionData.longitude = createRegionDto.locationCoordinates.longitude;
    regionData.disasterTypes = createRegionDto.disasterTypes;
    return this.regionRepository.save(regionData);
  }

  async findAll() {
    return this.regionRepository.find();
  }
}
