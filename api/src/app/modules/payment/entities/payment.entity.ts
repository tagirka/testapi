import {
  CreatedAt,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Index,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { AccountEntity } from '../../account/entities/account.entity';
import { ElsEntity } from '../../els/entities/els.entity';
import { CompanyEntity } from '../../company/entities/company.entity';
import { Make_Of_PaymentEntity } from '../../make_of_payment/entities/make_of_payment.entity';
import { Make_Of_ServiceEntity } from '../../make_of_service/entities/make_of_service.entity';

export interface IpaymentCreationAttrs {
  fk_els_id: number;
  fk_service_id: number;
  fk_company_id: number;
  code_so: string;
  sum_opl: number;
  date_opl: number;
  type_opl: string;
  billing_year: number;
  billing_month: number;
  doc_num: string;
  pay_num: string;
  fk_make_of_payment_id: number;
  fk_account_id: bigint;
}

@Table({ tableName: 'payment', timestamps: true })
export class PaymentEntity extends Model<PaymentEntity, IpaymentCreationAttrs> {
  @ApiProperty({ example: '001', description: 'ID' })
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @ApiProperty({
    example: '123',
    description: 'ID единого лицевого счета (ЕЛС).',
  })
  @Index('payment_els_index')
  @ForeignKey(() => ElsEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true }) //проверка null?
  fk_els_id: number;

  @ApiProperty({ example: '123', description: 'ID услуги' })
  @ForeignKey(() => Make_Of_ServiceEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true }) //проверка null?
  fk_service_id: number;

  @ApiProperty({
    example: '123',
    description: 'ID получателя платежа по услуге',
  })
  @ForeignKey(() => CompanyEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true }) //проверка null?
  fk_company_id: number;

  @ApiProperty({ example: '300_400', description: 'Код поставщика по услуге' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  code_so: string;

  @ApiProperty({ example: '123.45', description: 'Сумма оплаты' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  sum_opl: number;

  @ApiProperty({ example: '01.02.2023', description: 'Дата платежа' })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  date_opl: number;

  @ApiProperty({
    example: 'Касса',
    description:
      'Типы оплаты: кассы, терминалы, личный кабинет, сбербанк, почта.',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  type_opl: string;

  @ApiProperty({ example: '2023', description: 'Расчётный год' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  billing_year: number;

  @ApiProperty({ example: '12', description: 'Расчётный месяц' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  billing_month: number;

  @ApiProperty({
    example: '123454321',
    description: 'Уникальный номер документа (номер чека)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  doc_num: string;

  @ApiProperty({
    example: '123454321',
    description: 'Уникальный номер оплаты (номер позиции в чеке)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  pay_num: string;

  @ApiProperty({
    example: '123',
    description: 'Make_Of_Payment ID',
  })
  @ForeignKey(() => Make_Of_PaymentEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true }) //проверка null?
  fk_make_of_payment_id: number;

  @ApiProperty({
    example: '123',
    description: 'Account ID',
  })
  @ForeignKey(() => AccountEntity)
  @Column({ type: DataType.BIGINT, unique: false, allowNull: true }) //проверка null?
  fk_account_id: bigint;

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
    as: 'payment_els',
  })
  els: ElsEntity;

  @BelongsTo(() => Make_Of_ServiceEntity, {
    foreignKey: 'fk_service_id',
    targetKey: 'id',
    as: 'payment_service',
  })
  service: Make_Of_ServiceEntity;

  @BelongsTo(() => CompanyEntity, {
    foreignKey: 'fk_company_id',
    targetKey: 'id',
    as: 'payment_company',
  })
  company: CompanyEntity;

  @BelongsTo(() => Make_Of_PaymentEntity, {
    foreignKey: 'fk_make_of_payment_id',
    targetKey: 'id',
    as: 'make_of_payment_payment',
  })
  make_of_payment: Make_Of_PaymentEntity;

  @BelongsTo(() => AccountEntity, {
    foreignKey: 'fk_account_id',
    targetKey: 'id',
    as: 'account_payment',
  })
  account: AccountEntity;
}
