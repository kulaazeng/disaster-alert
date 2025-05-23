import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { Repository } from 'typeorm';
import { CreateRegionDto } from './dto/create-regions.dto';
import { UpdateRegionDto } from './dto/update-regions.dto';

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

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    if (!id) {
      throw new BadRequestException('Region ID is required');
    }
    const regionData = await this.regionRepository.findOne({ where: { id } });
    if (!regionData) {
      throw new NotFoundException('Region not found');
    }
    regionData.regionId = updateRegionDto.regionId;
    regionData.latitude = updateRegionDto.locationCoordinates.latitude;
    regionData.longitude = updateRegionDto.locationCoordinates.longitude;
    regionData.disasterTypes = updateRegionDto.disasterTypes;
    return this.regionRepository.save(regionData);
  }
}
