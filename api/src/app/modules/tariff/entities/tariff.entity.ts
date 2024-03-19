import {
  CreatedAt,
  BelongsTo,
  ForeignKey,
  HasMany,
  Column,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { Meters_DataEntity } from '../../meters_data/entities/meters_data.entity';
import { Operation_DetailsEntity } from '../../operation/operation_details/entities/operation_details.entity';
import { Make_Of_ServiceEntity } from '../../make_of_service/entities/make_of_service.entity';

export interface ItariffCreationAttrs {
  title: string;
  price: number;
  fk_service_id: number;
}

@Table({ tableName: 'tariff', timestamps: true })
export class TariffEntity extends Model<TariffEntity, ItariffCreationAttrs> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Горячая вода', description: 'Название' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  title: string;

  @ApiProperty({ example: '3.50', description: 'Прайс' })
  @Column({ type: DataType.DECIMAL(10, 2), unique: false, allowNull: true })
  price: number;

  @ForeignKey(() => Make_Of_ServiceEntity)
  @ApiProperty({ example: '1234', description: 'Service ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_service_id: number;

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
    as: 'tariff_meter',
  })
  meters_data: Meters_DataEntity[];

  @HasMany(() => Operation_DetailsEntity, {
    sourceKey: 'id',
    as: 'tariff_details',
  })
  operations: Operation_DetailsEntity[];

  @BelongsTo(() => Make_Of_ServiceEntity, {
    targetKey: 'id',
    as: 'service_tariff',
  })
  service: Make_Of_ServiceEntity;
}
