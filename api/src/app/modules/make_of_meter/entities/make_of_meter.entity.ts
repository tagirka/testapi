import {
  CreatedAt,
  HasMany,
  Column,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { Meters_DataEntity } from '../../meters_data/entities/meters_data.entity';

export interface Imake_of_meterCreationAttrs {
  type: string;
}

@Table({ tableName: 'make_of_meter', timestamps: true })
export class Make_Of_MeterEntity extends Model<
  Make_Of_MeterEntity,
  Imake_of_meterCreationAttrs
> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Индивидуальный', description: 'Тип счетчика' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  type: string;

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
    as: 'type_meter',
  })
  meters_data: Meters_DataEntity[];
}
