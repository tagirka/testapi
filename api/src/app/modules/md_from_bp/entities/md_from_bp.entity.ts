import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { ElsEntity } from '../../els/entities/els.entity';
import { Make_Of_ServiceEntity } from '../../make_of_service/entities/make_of_service.entity';

export interface Imd_from_bpCreationAttrs {
  els_id: number;
  service_id: number;
  guid: string;
  exid: string;
  dlind: number;
  nlind: number;
  dpind: number;
  npind: number;
  dnind: number;
  nnind: number;
  snum: string;
  place: string;
  idtu: string;
  mnum: string;
  sname: string;
  billing_year: number;
  billing_month: number;
  exchange_code: string;
}

@Table({ tableName: 'md_from_bp', timestamps: false })
export class MD_From_BPEntity extends Model<
  MD_From_BPEntity,
  Imd_from_bpCreationAttrs
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
  @Column({ type: DataType.BIGINT, unique: false, allowNull: true })
  els_id: number;

  @ApiProperty({ example: 'Строка', description: 'Код услуги' })
  @ForeignKey(() => Make_Of_ServiceEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  service_id: number;

  @ApiProperty({
    example: 'Строка',
    description: 'Идентификатор GUID из пакета ответа на запрос.',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  guid: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Идентификатор показания в передающей системе',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  exid: string;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата последних показаний',
  })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  dlind: number;

  @ApiProperty({ example: 'Вещественный', description: 'Последние показания' })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  nlind: number;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата предыдущих показаний',
  })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  dpind: number;

  @ApiProperty({ example: 'Вещественный', description: 'Предыдущие показания' })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  npind: number;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата новых (неподтвержденных) показаний',
  })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  dnind: number;

  @ApiProperty({
    example: 'Вещественный',
    description:
      'Последние новые (неподтвержденные) показания, переданные в текущем периоде',
  })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  nnind: number;

  @ApiProperty({
    example: 'Строка',
    description: 'Серийный номер',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  snum: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Место установки',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  place: string;

  @ApiProperty({
    example: 'Строка',
    description: 'ИД точки учета',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  idtu: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Маркировочный номер',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  mnum: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Наименование шкалы',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  sname: string;

  @ApiProperty({ example: '2023', description: 'Расчётный год' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  billing_year: number;

  @ApiProperty({
    example: '12',
    description: 'Расчётный месяц',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  billing_month: number;

  @ApiProperty({
    example: 'Строка (300)',
    description: 'Уникальный код, идентифицирующий прибор учёта клиента',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  exchange_code: string;

  @BelongsTo(() => ElsEntity, {
    foreignKey: 'els_id',
    targetKey: 'id',
    as: 'els_md_bp',
  })
  els: ElsEntity;

  @BelongsTo(() => Make_Of_ServiceEntity, {
    foreignKey: 'service_id',
    targetKey: 'id',
    as: 'service_md_bp',
  })
  service: Make_Of_ServiceEntity;
}
