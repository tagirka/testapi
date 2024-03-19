import {
  CreatedAt,
  BelongsTo,
  ForeignKey,
  HasMany,
  Index,
  Column,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { AccountEntity } from '../../account/entities/account.entity';
import { BasketItemsEntity } from '@webapi/app/controllers/acquiring/entities/basket_items.entity';
import { ElsEntity } from '../../els/entities/els.entity';
import { CompanyEntity } from '../../company/entities/company.entity';
import { MeasureEntity } from '../../measure/entities/measure.entity';
import { Operation_DetailsEntity } from '../../operation/operation_details/entities/operation_details.entity';
import { Make_Of_ServiceEntity } from '../../make_of_service/entities/make_of_service.entity';
import { Make_Of_DebtEntity } from '../../make_of_debt/entities/make_of_debt.entity';

export interface IoperationCreationAttrs {
  fk_els_id: number;
  fk_service_id: number;
  fk_company_id: number;
  billing_year: number;
  billing_month: number;
  sum_z: number;
  sum_opl: number;
  sum_final: number;
  fk_measure_id: number;
  fk_account_id: number;
  fk_make_of_debt_id: number;
}

@Table({ tableName: 'operation', timestamps: true })
export class OperationEntity extends Model<
  OperationEntity,
  IoperationCreationAttrs
> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @ApiProperty({ example: '1234', description: 'Уникальный ЕЛС ID' })
  @Index('operation_els_index')
  @ForeignKey(() => ElsEntity)
  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: true,
    primaryKey: false,
  })
  fk_els_id: number;

  @Index('operation_index')
  @ApiProperty({ example: '123', description: 'ID услуги' })
  @ForeignKey(() => Make_Of_ServiceEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_service_id: number;

  @ApiProperty({
    example: '123',
    description: 'ID получателя платежа по услуге',
  })
  @ForeignKey(() => CompanyEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true }) //проверка null?
  fk_company_id: number;

  @Index('operation_index')
  @ApiProperty({ example: '2023', description: 'Расчётный год' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  billing_year: number;

  @Index('operation_index')
  @ApiProperty({ example: '12', description: 'Расчётный месяц' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  billing_month: number;

  @ApiProperty({
    example: '123.45',
    description: 'Сальдо по клиенту на начало периода',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  sum_z: number;

  @ApiProperty({
    example: '123.45',
    description: 'Оплачено за расчётный период',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  sum_opl: number;

  @ApiProperty({
    example: '123.45',
    description: 'Сумма к оплате на конец периода (с учётом сальдо).',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true }) //DECIMAL(12, 2)
  sum_final: number;

  @ForeignKey(() => MeasureEntity)
  @ApiProperty({ example: '123', description: 'Measure ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_measure_id: number;

  @Index('operation_index')
  @ForeignKey(() => AccountEntity)
  @ApiProperty({ example: '123', description: 'Account ID' })
  @Column({ type: DataType.BIGINT, unique: false, allowNull: true })
  fk_account_id: bigint;

  @ForeignKey(() => Make_Of_DebtEntity)
  @ApiProperty({ example: '123', description: 'Make_Of_Debt ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_make_of_debt_id: number;

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

  @HasMany(() => Operation_DetailsEntity, {
    sourceKey: 'id',
    as: 'details',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  operations: Operation_DetailsEntity[];

  @HasMany(() => BasketItemsEntity, {
    sourceKey: 'id',
    as: 'operation_basketItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  basket_items: BasketItemsEntity[];

  @BelongsTo(() => AccountEntity, {
    foreignKey: 'fk_account_id',
    targetKey: 'id',
    as: 'account_operation',
  })
  account: AccountEntity;

  @BelongsTo(() => ElsEntity, {
    foreignKey: 'fk_els_id',
    targetKey: 'id',
    as: 'operation_els',
  })
  els: ElsEntity;

  @BelongsTo(() => Make_Of_ServiceEntity, {
    foreignKey: 'fk_service_id',
    targetKey: 'id',
    as: 'operation_service',
  })
  service: Make_Of_ServiceEntity;

  @BelongsTo(() => CompanyEntity, {
    foreignKey: 'fk_company_id',
    targetKey: 'id',
    as: 'operation_company',
  })
  company: CompanyEntity;

  @BelongsTo(() => MeasureEntity, {
    foreignKey: 'fk_measure_id',
    targetKey: 'id',
    as: 'measure_operation',
  })
  measure: MeasureEntity;

  @BelongsTo(() => Make_Of_DebtEntity, {
    foreignKey: 'fk_make_of_debt_id',
    targetKey: 'id',
    as: 'make_of_debt_operation',
  })
  make_of_debt: Make_Of_DebtEntity;
}
