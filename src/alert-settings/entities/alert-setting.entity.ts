import { Region } from 'src/regions/entities/region.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('alert_settings')
export class AlertSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  regionId: string;

  @Column()
  thresholdScore: number;

  @Column()
  disasterType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
