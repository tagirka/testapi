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

import { PaymentEntity } from '../../payment/entities/payment.entity';

export interface Imake_of_paymentCreationAttrs {
  title: string;
  description: string;
}

@Table({ tableName: 'make_of_payment', timestamps: true })
export class Make_Of_PaymentEntity extends Model<
  Make_Of_PaymentEntity,
  Imake_of_paymentCreationAttrs
> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Имя', description: 'Заголовок' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  title: string;

  @ApiProperty({ example: 'Описание', description: 'Описание' })
  @Column({ type: DataType.TEXT, unique: false, allowNull: true })
  description: string;

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

  @HasMany(() => PaymentEntity, {
    sourceKey: 'id',
    as: 'make_of_payment_payment',
  })
  payments: PaymentEntity[];
}
