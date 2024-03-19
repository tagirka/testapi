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
import { OperationEntity } from '../../operation/entities/operation.entity';

export interface ImeasureCreationAttrs {
  title: string;
  recalc: number;
}

@Table({ tableName: 'measure', timestamps: true })
export class MeasureEntity extends Model<MeasureEntity, ImeasureCreationAttrs> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'М.кв.', description: 'Тип единицы измерения' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  title: string;

  @ApiProperty({ example: '1', description: 'Пересчет' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  recalc: number;

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
    as: 'measure_meter',
  })
  meters_data: Meters_DataEntity[];

  @HasMany(() => OperationEntity, {
    sourceKey: 'id',
    as: 'measure_operation',
  })
  operations: OperationEntity[];
}
