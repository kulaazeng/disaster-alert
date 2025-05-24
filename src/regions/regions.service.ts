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
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
    private readonly redisService: RedisService,
  ) {}

  async create(createRegionDto: CreateRegionDto) {
    const regionData = new Region();
    regionData.regionId = createRegionDto.regionId;
    regionData.latitude = createRegionDto.locationCoordinates.latitude;
    regionData.longitude = createRegionDto.locationCoordinates.longitude;
    regionData.disasterTypes = createRegionDto.disasterTypes;

    const region = await this.regionRepository.save(regionData);
    await this.redisService.del('regions');

    return region;
  }

  async findAll() {
    const regionsData = await this.redisService.get('regions');
    if (regionsData) {
      return JSON.parse(regionsData);
    }

    const regions = await this.regionRepository.find();

    await this.redisService.set('regions', JSON.stringify(regions), 60 * 15);
    return regions;
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

    const region = await this.regionRepository.save(regionData);
    await this.redisService.del('regions');

    return region;
  }
}
