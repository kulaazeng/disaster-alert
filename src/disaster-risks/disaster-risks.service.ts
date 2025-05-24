import { Injectable } from '@nestjs/common';
import { DisasterRisksRes } from './dto/disaster-risks-res';
import { WeatherResponse } from 'src/common/interface/weather.interface';
import { DisasterDataService } from 'src/disaster-data/disaster-data.service';
import { RegionsService } from 'src/regions/regions.service';
import { Region } from 'src/regions/entities/region.entity';

@Injectable()
export class DisasterRisksService {
  constructor(
    private readonly regionsService: RegionsService,
    private readonly weatherService: DisasterDataService,
  ) {}

  async getAllDisasterRisks(): Promise<DisasterRisksRes[]> {
    const disasterRisks: DisasterRisksRes[] = [];

    const regions = await this.regionsService.findAll();

    const usgsData = await this.weatherService.getUSGSData();

    for (const region of regions) {
      const disasterTypes = region.disasterTypes;
      for (const disasterType of disasterTypes) {
        const weather = await this.weatherService.getWeather(
          region.latitude,
          region.longitude,
        );
        const riskScore = this.calculateRisksScore(
          disasterType,
          weather,
          region,
          usgsData,
        );
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

  calculateRisksScore(
    disasterType: string,
    weather: WeatherResponse,
    region: Region,
    usgsData: USGSData,
  ): number {
    switch (disasterType) {
      case 'flood':
        return this.calculateFloodScore(weather);
      case 'wildfire':
        return this.calculateWildfireScore(weather);
      case 'earthquake':
        return this.calculateEarthquakeRiskScore(
          weather.main.temp,
          this.haversineDistance(
            region.latitude,
            region.longitude,
            usgsData.features[0].geometry.coordinates[1],
            usgsData.features[0].geometry.coordinates[0],
          ),
          0,
        );
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

  haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  calculateEarthquakeRiskScore(
    magnitude: number,
    distanceKm: number,
    depthKm: number,
  ): number {
    const magScore = Math.min(magnitude * 10, 100); // ปรับ scale
    const distanceFactor = Math.max(0, 1 - distanceKm / 500); // ถ้าไกลกว่า 500 กม. → แทบไม่มีผล
    const depthFactor = depthKm < 70 ? 1 : 0.7; // ตื้น = 1, ลึก = 0.7

    const rawScore = magScore * distanceFactor * depthFactor;
    return Math.round(Math.min(rawScore, 100));
  }
}
