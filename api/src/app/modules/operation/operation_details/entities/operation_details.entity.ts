import {
  BelongsTo,
  ForeignKey,
  Index,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { OperationEntity } from '../../entities/operation.entity';
import { TariffEntity } from '../../../tariff/entities/tariff.entity';

export interface Ioperation_detailsCreationAttrs {
  fk_operation_id: bigint;
  sum_accrual: number;
  sum_recalc: number;
  scope_service: number;
  fk_tariff_id: number;
}

@Table({ tableName: 'operation_details', timestamps: false })
export class Operation_DetailsEntity extends Model<
  Operation_DetailsEntity,
  Ioperation_detailsCreationAttrs
> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @ApiProperty({ example: '1234', description: 'Уникальный Operation ID' })
  @Index('operation_details_operation_index')
  @ForeignKey(() => OperationEntity)
  @Column({
    type: DataType.BIGINT,
    unique: false,
    allowNull: true,
    primaryKey: false,
  })
  fk_operation_id: bigint;

  @ApiProperty({
    example: '123.45',
    description: 'Сумма начислений на начало периода',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  sum_accrual: number; //SUM_NACH

  @ApiProperty({
    example: '123.45',
    description: 'Сумма перерасчета на начало периода',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true }) //DECIMAL(12, 2)
  sum_recalc: number; //SUM_RERAS

  @ApiProperty({
    example: '123.45',
    description: 'Объём потреблённой услуги.',
  })
  @Column({ type: DataType.DECIMAL(16, 6), unique: false, allowNull: true })
  scope_service: number; //VOLUME

  @ForeignKey(() => TariffEntity)
  @ApiProperty({ example: '123', description: 'Tarif ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_tariff_id: number;

  @BelongsTo(() => OperationEntity, {
    foreignKey: 'fk_operation_id',
    targetKey: 'id',
    as: 'details',
  })
  operation: OperationEntity;

  @BelongsTo(() => TariffEntity, {
    foreignKey: 'fk_tariff_id',
    targetKey: 'id',
    as: 'tariff_details',
  })
  tarif: TariffEntity;
}
