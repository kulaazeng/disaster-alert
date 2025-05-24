import { Injectable } from '@nestjs/common';
import { DisasterRisksRes } from './dto/disaster-risks-res';
import { WeatherResponse } from 'src/common/interface/weather.interface';
import { DisasterDataService } from 'src/disaster-data/disaster-data.service';
import { RegionsService } from 'src/regions/regions.service';
import { Region } from 'src/regions/entities/region.entity';
import { AlertSettingsService } from 'src/alert-settings/alert-settings.service';

@Injectable()
export class DisasterRisksService {
  constructor(
    private readonly regionsService: RegionsService,
    private readonly alertSettingsService: AlertSettingsService,
    private readonly weatherService: DisasterDataService,
  ) {}

  async getAllDisasterRisks(): Promise<DisasterRisksRes[]> {
    const disasterRisks: DisasterRisksRes[] = [];

    //ดึงข้อมูล region ทั้งหมด
    const regions = await this.regionsService.findAll();

    //ดึงข้อมูล usgs data
    const usgsData = await this.weatherService.getUSGSData();

    //วนลูปทั้งหมด region และ disaster type ที่มีอยู่ ของแต่ละ region
    for (const region of regions) {
      //ดึงข้อมูล disaster type ที่มีอยู่ ของแต่ละ region
      const disasterTypes = region.disasterTypes;

      //ดึงข้อมูล weather ของแต่ละ region
      const weather = await this.weatherService.getWeather(
        region.latitude,
        region.longitude,
      );

      //วนลูปทั้งหมด disaster type ของแต่ละ region
      for (const disasterType of disasterTypes) {
        //ดึงข้อมูล weather ของแต่ละ region

        //คำนวณความเสี่ยงของแต่ละ disaster type
        const riskScore = this.calculateRisksScore(
          disasterType,
          weather,
          region,
          usgsData,
        );

        //คำนวณระดับความเสี่ยง
        const riskLevel = this.getRiskLevel(riskScore);

        //สร้างข้อมูลความเสี่ยงของแต่ละ disaster type ของแต่ละ region
        const disasterRisksRes: DisasterRisksRes = {
          //ข้อมูล region R1, R2, R3, R4, R5
          regionId: region.regionId,
          //ข้อมูล disaster type ที่มีอยู่ ของแต่ละ region
          disasterType: disasterType,
          //ความเสี่ยงของแต่ละ disaster type
          riskScore: riskScore,
          //ระดับความเสี่ยง
          riskLevel: riskLevel,
          //ตรวจสอบว่ามี alert หรือไม่
          alertTriggered: await this.alertTriggered(
            disasterType,
            riskScore,
            region,
          ),
        };

        disasterRisks.push(disasterRisksRes);
      }
    }

    //ส่งข้อมูลความเสี่ยงของแต่ละ disaster type ของแต่ละ region
    return disasterRisks;
  }

  // alert triggered from alert-settings
  async alertTriggered(
    disasterType: string,
    riskScore: number,
    region: Region,
  ): Promise<boolean> {
    //ดึงข้อมูล alert-settings ของแต่ละ region
    const alertSettings = await this.alertSettingsService.findByRegion(
      region.regionId,
    );
    //ค้นหา alert-setting ของแต่ละ disaster type
    const alertSetting = alertSettings.find(
      (alertSetting) => alertSetting.disasterType === disasterType,
    );
    //ตรวจสอบว่ามี alert-setting หรือไม่
    if (!alertSetting) return false;
    //ตรวจสอบว่าความเสี่ยงมากกว่า thresholdScore หรือไม่ ถ้าใช่ จะส่งข้อมูลกลับเป็น true และใช้ส่ง alert notification
    return riskScore >= alertSetting?.thresholdScore;
  }

  //คำนวณความเสี่ยงของแต่ละ disaster type
  calculateRisksScore(
    disasterType: string,
    weather: WeatherResponse,
    region: Region,
    usgsData: USGSData,
  ): number {
    switch (disasterType) {
      //คำนวณความเสี่ยงของน้ำท่วม
      case 'flood':
        return this.calculateFloodScore(weather);
      //คำนวณความเสี่ยงของไฟป่า
      case 'wildfire':
        return this.calculateWildfireScore(weather);
      //คำนวณความเสี่ยงของแผ่นดินไหว
      case 'earthquake':
        return this.calculateEarthquakeRiskScore(
          this.findNearestEarthquake(region, usgsData).properties.mag,
          this.haversineDistance(
            region.latitude, // latitude
            region.longitude, // longitude
            usgsData.features[0].geometry.coordinates[1], // latitude
            usgsData.features[0].geometry.coordinates[0], // longitude
          ),
          this.findNearestEarthquake(region, usgsData).geometry.coordinates[2],
        );
      default:
        return 0;
    }
  }

  //คำนวณระดับความเสี่ยง จากความเสี่ยงที่คำนวณได้
  getRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 90) return 'high';
    if (score >= 60) return 'medium';
    if (score >= 30) return 'low';
    return 'low';
  }

  //คำนวณความเสี่ยงของน้ำท่วม
  calculateFloodScore(weather: WeatherResponse): number {
    let score = 0;
    //ปริมาณน้ำฝนต่อชั่วโมง
    const rain = weather.rain?.['1h'] ?? 0;
    //ถ้าปริมาณน้ำฝนต่อชั่วโมงมากกว่า 10 มม. → ความเสี่ยงสูงสุด
    if (rain > 10) score += 100;
    //ถ้าปริมาณน้ำฝนต่อชั่วโมงมากกว่า 5 มม. → ความเสี่ยงสูงสุด
    if (rain > 5) score += 40;
    //ถ้าปริมาณน้ำฝนต่อชั่วโมงมากกว่า 1 มม. → ความเสี่ยงกลาง
    else if (rain >= 1) score += 20;
    //ถ้าปริมาณน้ำฝนต่อชั่วโมงมากกว่า 0 มม. → ความเสี่ยงต่ำ
    else if (rain > 0) score += 5;

    return score;
  }

  //คำนวณคะแนนไฟป่า 
  calculateWildfireScore(weather: WeatherResponse): number {
    let score = 0;

    //ถ้าความชื้นของอากาศต่ำกว่า 30% → ความเสี่ยงสูงสุด
    if (weather.main.humidity < 30) score += 40;
    //ถ้าอุณหภูมิของอากาศสูงกว่า 35°C → ความเสี่ยงสูงสุด
    const tempCelsius = weather.main.temp - 273.15;
    if (tempCelsius > 35) score += 30;
    //ถ้าความเร็วลมสูงกว่า 6 m/s → ความเสี่ยงสูงสุด
    if (weather.wind.speed > 6) score += 20;
    //ถ้าความมืดของอากาศต่ำกว่า 20% → ความเสี่ยงสูงสุด
    if (weather.clouds.all < 20) score += 10;

    return score;
  }

  //คำนวณระยะทางระหว่างจุดสองจุด จากสูตรของ haversine
  haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    //คำนวณระยะทางระหว่างจุดสองจุด
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // รัศมีของโลก

    //คำนวณระยะห่างของ ละติจูด
    const dLat = toRad(lat2 - lat1);
    //คำนวณระยะห่างของ ลองจิจูด
    const dLon = toRad(lon2 - lon1);


    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    //ระยะทางหน่วยเป็นกิโลเมตร จากสูตรของ haversine
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // calculate earthquake risk score chatgpt
  calculateEarthquakeRiskScore(
    magnitude: number,
    distanceKm: number,
    depthKm: number,
  ): number {
    //คำนวณคะแนนของความรุนแรงของแผ่นดินไหว
    const magScore = Math.min(magnitude * 10, 100); // ปรับ scale
    //คำนวณคะแนนของระยะทางของแผ่นดินไหว
    const distanceFactor = Math.max(0, 1 - distanceKm / 500); // ถ้าไกลกว่า 500 กม. → แทบไม่มีผล
    //คำนวณคะแนนของความลึกของแผ่นดินไหว 
    const depthFactor = depthKm < 70 ? 1 : 0.7; // ตื้น = 1, ลึก = 0.7

    //คำนวณคะแนนของแผ่นดินไหว
    const rawScore = magScore * distanceFactor * depthFactor;
    //คำนวณคะแนนของแผ่นดินไหว จากคะแนนของความรุนแรงของแผ่นดินไหว ระยะทางของแผ่นดินไหว และความลึกของแผ่นดินไหว
    return Math.round(Math.min(rawScore, 100));
  }

  //find nearest earthquake
  findNearestEarthquake(region: Region, usgsData: USGSData): Feature {
    //ดึงข้อมูลแผ่นดินไหวทั้งหมด
    const earthquakes = usgsData.features;
    // คำนวนวนระยะทาง และเรียงลำดับจากระยะทางที่น้อยที่สุด
    const nearestEarthquake = earthquakes.sort(
      (a, b) =>
        this.haversineDistance(
          region.latitude,
          region.longitude,
          a.geometry.coordinates[1],
          a.geometry.coordinates[0],
        ) -
        this.haversineDistance(
          region.latitude,
          region.longitude,
          b.geometry.coordinates[1],
          b.geometry.coordinates[0],
        ),
    )[0];
    //ส่งข้อมูลแผ่นดินไหวที่อยู่ใกล้ที่สุด ของแต่ละ region
    return nearestEarthquake;
  }
}
