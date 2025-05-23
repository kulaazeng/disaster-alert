import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsNumber, IsString } from 'class-validator';

class LocationCoordinates {
  @ApiProperty({
    description: 'ละติจูด',
    example: 34.0522,
  })
  @IsNumber({}, { message: 'latitudeIsRequired' })
  @IsNotEmpty({ message: 'latitudeIsRequired' })
  latitude: number;

  @ApiProperty({
    description: 'ลองติจูด',
    example: -118.2437,
  })
  @IsNumber({}, { message: 'longitudeIsRequired' })
  @IsNotEmpty({ message: 'longitudeIsRequired' })
  longitude: number;
}

export class UpdateRegionDto {
  @ApiProperty({
    description: 'Region ID Unique',
    example: 'R1',
  })
  @IsString({ message: 'regionIdIsRequired' })
  @IsNotEmpty({ message: 'regionIdIsRequired' })
  regionId: string;

  @ApiProperty({
    description: 'GPS (latitude, longitude)',
  })
  locationCoordinates: LocationCoordinates;

  @ApiProperty({
    description: 'Disaster Types เป็น array string',
    example: ['flood', 'earthquake', 'wildfire'],
  })
  @IsArray()
  @IsNotEmpty({ message: 'disasterTypesIsRequired' })
  disasterTypes: string[];
}
