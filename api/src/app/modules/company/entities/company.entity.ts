import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  HasMany,
  Index,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { Meters_DataEntity } from '../../meters_data/entities/meters_data.entity';
import { OperationEntity } from '../../operation/entities/operation.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';

export interface IcompanyCreationAttrs {
  code: string;
  name: string;
  inn: string;
  address: string;
  priority: number;
  guid_so: string;
  phone: string;
  off_payment: number;
}

@Table({ tableName: 'company', timestamps: true })
export class CompanyEntity extends Model<CompanyEntity, IcompanyCreationAttrs> {
  @ApiProperty({ example: '001', description: 'ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '004_300',
    description: 'Код контрагента(до 40 символов)',
  })
  @Index('code_index')
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    primaryKey: false,
  })
  code: string;

  @ApiProperty({
    example: "ООО 'Новая энергия'",
    description: 'Наименование контрагента',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  name: string;

  @ApiProperty({ example: '7410983337262', description: 'ИНН контрагента' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  inn: string;

  @ApiProperty({
    example: 'г.Челябинск, пр.Ленина, д.1',
    description: 'Адрес контрагента',
  })
  @Column({ type: DataType.TEXT, unique: false, allowNull: true })
  address: string;

  @ApiProperty({ example: '1', description: 'Приоритетность при сортировке' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  priority: number;

  @ApiProperty({
    example: 'bf682aa0-c9de-11eb-a67c-6c4b903e490a',
    description: 'Уникальный иднетификатор поставщика 36 символов',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  guid_so: string;

  @ApiProperty({ example: '89193322217', description: 'Телефон контрагента' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  phone: string;

  @ApiProperty({
    example: '1',
    description:
      "Признак компании по приему платежей через ЛК, принимает значение '0' или '1'",
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  off_payment: number;

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
    as: 'company_meter',
  })
  meters_data: Meters_DataEntity[];

  @HasMany(() => OperationEntity, {
    sourceKey: 'id',
    as: 'operation_company',
  })
  operations: OperationEntity[];

  @HasMany(() => PaymentEntity, {
    sourceKey: 'id',
    as: 'payment_company',
  })
  payments: PaymentEntity[];
}
