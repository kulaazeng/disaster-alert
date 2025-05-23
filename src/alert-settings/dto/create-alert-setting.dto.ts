import { IsNumber, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAlertSettingDto {
    @ApiProperty({
        description: 'Region ID',
        example: 'R1',
    })
    @IsString({ message: 'regionIdIsRequired' })
    @IsNotEmpty({ message: 'regionIdIsRequired' })
    regionId: string;

    @ApiProperty({
        description: 'Threshold Score',
        example: 75,
    })
    @IsNumber({}, { message: 'thresholdScoreIsRequired' })
    @IsNotEmpty({ message: 'thresholdScoreIsRequired' })
    thresholdScore: number;

    @ApiProperty({
        description: 'Disaster Type',
        example: 'flood',
    })
    @IsString({ message: 'disasterTypeIsRequired' })
    @IsNotEmpty({ message: 'disasterTypeIsRequired' })
    disasterType: string;

}

    