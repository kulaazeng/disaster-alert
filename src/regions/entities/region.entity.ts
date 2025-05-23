import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('regions')
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  regionId: string;

  @Column('simple-array')
  disasterTypes: string[];

  @Column('decimal')
  latitude: number;

  @Column('decimal')
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
