import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { ElsEntity } from '@webapi/app/modules/els/entities/els.entity';
import { Make_Of_ServiceEntity } from '@webapi/app/modules/make_of_service/entities/make_of_service.entity';
import { Meters_DataEntity } from '@webapi/app/modules/meters_data/entities/meters_data.entity';

export interface ImdFromUsersCreationAttrs {
  fk_els_id: number;
  fk_service_id: number;
  fk_meters_data_id: bigint;
  volume: number;
  date_meter_reading: Date;
  date_entering: Date;
  exchange_code: string;
}

@Table({ tableName: 'md_from_users', timestamps: true })
export class MD_From_UsersEntity extends Model<
  MD_From_UsersEntity,
  ImdFromUsersCreationAttrs
> {
  @ApiProperty({ example: '001', description: 'ID' })
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @ApiProperty({
    example: '7406070809',
    description: 'Единый лицевой счет (ЕЛС)',
  })
  @ForeignKey(() => ElsEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: false })
  fk_els_id: number;

  @ApiProperty({ example: 'Строка', description: 'Код услуги' })
  @ForeignKey(() => Make_Of_ServiceEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: false })
  fk_service_id: number;

  @ApiProperty({
    example: 'Строка',
    description: 'ID показаний счетчиков (meters_data)',
  })
  @ForeignKey(() => Meters_DataEntity)
  @Column({ type: DataType.BIGINT, unique: false, allowNull: false })
  fk_meters_data_id: bigint;

  @ApiProperty({ example: 'Вещественный', description: 'Последние показания' })
  @Column({ type: DataType.DECIMAL(14, 6), unique: false, allowNull: false })
  volume: number;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата снятия показаний по клиенту',
  })
  @Column({ type: DataType.DATE, unique: false, allowNull: true })
  date_meter_reading: Date;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата внесения показаний в систему',
  })
  @Column({ type: DataType.DATE, unique: false, allowNull: false })
  date_entering: Date;

  @ApiProperty({
    example: 'Строка (300)',
    description: 'Уникальный код, идентифицирующий прибор учёта клиента',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  exchange_code: string;

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

  @BelongsTo(() => ElsEntity, {
    foreignKey: 'fk_els_id',
    targetKey: 'id',
    as: 'els_md_users',
  })
  els: ElsEntity;

  @BelongsTo(() => Make_Of_ServiceEntity, {
    foreignKey: 'fk_service_id',
    targetKey: 'id',
    as: 'service_md_users',
  })
  service: Make_Of_ServiceEntity;

  @BelongsTo(() => Meters_DataEntity, {
    foreignKey: 'fk_meters_data_id',
    targetKey: 'id',
    as: 'meters_data_md_users',
  })
  md: Meters_DataEntity;
}
