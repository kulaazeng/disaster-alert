import { Body, Controller, Post } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-regions.dto';

@Controller('regions')
export class RegionsController {
    constructor(private readonly regionsService: RegionsService) { }

    @Post()
    create(@Body() createRegionDto: CreateRegionDto) {
        return this.regionsService.create(createRegionDto);
    }
}
