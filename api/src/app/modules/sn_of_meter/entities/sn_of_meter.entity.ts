import {
  CreatedAt,
  Index,
  HasMany,
  Column,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { Meters_DataEntity } from '../../meters_data/entities/meters_data.entity';

export interface Isn_of_meterCreationAttrs {
  sn: string;
}

@Table({ tableName: 'sn_of_meter', timestamps: true })
export class SN_Of_MeterEntity extends Model<
  SN_Of_MeterEntity,
  Isn_of_meterCreationAttrs
> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'СУ-0123456789',
    description: 'Серийный номер счетчика',
  })
  @Index('sn_index')
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  sn: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updated_at: Date;

  @HasMany(() => Meters_DataEntity, {
    sourceKey: 'id',
    as: 'sn_meters',
  })
  meters_data: Meters_DataEntity[];
}
