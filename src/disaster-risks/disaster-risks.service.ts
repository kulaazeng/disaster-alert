import { Injectable } from '@nestjs/common';
import { DisasterRisksRes } from './dto/disaster-risks-res';
import { WeatherResponse } from 'src/common/interface/weather.interface';
import { DisasterDataService } from 'src/disaster-data/disaster-data.service';
import { RegionsService } from 'src/regions/regions.service';

@Injectable()
export class DisasterRisksService {
    constructor(
        private readonly regionsService: RegionsService,
        private readonly weatherService: DisasterDataService,
    ) { }

    async getAllDisasterRisks(): Promise<DisasterRisksRes[]> {

        const disasterRisks: DisasterRisksRes[] = [];

        const regions = await this.regionsService.findAll();

        for (const region of regions) {
            const disasterTypes = region.disasterTypes;
            for (const disasterType of disasterTypes) {
                const weather = await this.weatherService.getWeather(
                    region.latitude,
                    region.longitude,
                );
                const riskScore = this.calculateRisksScore(disasterType, weather);
                const riskLevel = this.getRiskLevel(riskScore);

                const disasterRisksRes: DisasterRisksRes = {
                    regionId: region.regionId,
                    disasterType: disasterType,
                    riskScore: riskScore,
                    riskLevel: riskLevel,
                    alertTriggered: true,
                };

                disasterRisks.push(disasterRisksRes);
            }
        }

        return disasterRisks;
    }

    calculateRisksScore(disasterType: string, weather: WeatherResponse): number {
        switch (disasterType) {
            case 'flood':
                return this.calculateFloodScore(weather);
            case 'wildfire':
                return this.calculateWildfireScore(weather);
            default:
                return 0;
        }
    }

    // Low, Medium, High
    getRiskLevel(score: number): 'low' | 'medium' | 'high' {
        if (score >= 90) return 'high';
        if (score >= 60) return 'medium';
        if (score >= 30) return 'low';
        return 'low';
    }

    calculateFloodScore(weather: WeatherResponse): number {
        let score = 0;

        const rain = weather.rain?.['1h'] ?? 0;
        if (rain > 5) score += 40;
        else if (rain >= 1) score += 20;
        else if (rain > 0) score += 5;

        return score;
    }

    calculateWildfireScore(weather: WeatherResponse): number {
        let score = 0;

        if (weather.main.humidity < 30) score += 40;
        const tempCelsius = weather.main.temp - 273.15;
        if (tempCelsius > 35) score += 30;
        if (weather.wind.speed > 6) score += 20;
        if (weather.clouds.all < 20) score += 10;

        return score;
    }
}
