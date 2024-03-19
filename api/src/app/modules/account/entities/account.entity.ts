import { Op, Sequelize } from 'sequelize';
import {
  CreatedAt,
  Index,
  BelongsTo,
  HasMany,
  ForeignKey,
  Column,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { ElsEntity } from '../../els/entities/els.entity';
import { OperationEntity } from '../../operation/entities/operation.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { Make_Of_ServiceEntity } from '../../make_of_service/entities/make_of_service.entity';

export interface IaccountCreationAttrs {
  personal_account: string;
  fk_service_id: number;
  fk_els_id: number;
}

@Table({ tableName: 'account', timestamps: true })
export class AccountEntity extends Model<AccountEntity, IaccountCreationAttrs> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @Index('account_index')
  @ApiProperty({ example: '1234567890', description: 'Лицевой счет' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  personal_account: string;

  @ForeignKey(() => Make_Of_ServiceEntity)
  @Index('account_index')
  @ApiProperty({ example: '1234', description: 'Service ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_service_id: number;

  @ForeignKey(() => ElsEntity)
  @Index('account_els_index')
  @ApiProperty({ example: '1234', description: 'Tarif ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_els_id: number;

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

  @HasMany(() => OperationEntity, {
    sourceKey: 'id',
    as: 'account_operation',
  })
  operations: OperationEntity[];

  @HasMany(() => PaymentEntity, {
    sourceKey: 'id',
    as: 'account_payment',
  })
  payments: PaymentEntity[];

  @BelongsTo(() => ElsEntity, {
    targetKey: 'id',
    as: 'els_account',
  })
  elses: ElsEntity[];

  @BelongsTo(() => Make_Of_ServiceEntity, {
    targetKey: 'id',
    as: 'service_account',
  })
  service: Make_Of_ServiceEntity;
}
