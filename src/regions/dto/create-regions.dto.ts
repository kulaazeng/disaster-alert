import { IsNotEmpty, IsArray, IsNumber, IsString } from 'class-validator';

class LocationCoordinates {
  @IsNumber({}, { message: 'latitudeIsRequired' })
  @IsNotEmpty({ message: 'latitudeIsRequired' })
  latitude: number;

  @IsNumber({}, { message: 'longitudeIsRequired' })
  @IsNotEmpty({ message: 'longitudeIsRequired' })
  longitude: number;
}

export class CreateRegionDto {
  @IsString({ message: 'regionIdIsRequired' })
  @IsNotEmpty({ message: 'regionIdIsRequired' })
  regionId: string;

  locationCoordinates: LocationCoordinates;

  @IsArray()
  @IsNotEmpty({ message: 'disasterTypesIsRequired' })
  disasterTypes: string[];
}
