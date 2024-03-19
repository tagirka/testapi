import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { BankSessionsEntity } from './bank_sessions.entity';
import { BasketItemsEntity } from './basket_items.entity';
import { UserModel } from '@webapi/app/controllers/auth/user/models/user.model';

export interface IBasketCreationAttrs {
  id?: bigint;
  fk_user_id: number;
  order_number?: string;
  date_basket: Date;
  amount: number;
}

@Table({ tableName: 'basket', timestamps: true })
export class BasketEntity extends Model<BasketEntity, IBasketCreationAttrs> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @ForeignKey(() => UserModel)
  @ApiProperty({ example: '12345', description: 'User ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: false })
  fk_user_id: number;

  @ApiProperty({ example: '0000000001', description: 'Номер ордера' })
  @Column({
    type: DataType.STRING,
    defaultValue: '0000000000',
    unique: false,
    allowNull: false,
  })
  order_number: string;

  @ApiProperty({
    example: '01.01.2024',
    description: 'Дата формирования корзины.',
  })
  @Column({ type: DataType.DATE, unique: false, allowNull: true })
  date_basket: Date;

  @ApiProperty({
    example: '12345',
    description: 'Сумма корзины на оплату, в копейках',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: false })
  amount: number;

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

  @HasMany(() => BankSessionsEntity, {
    sourceKey: 'id',
    as: 'basket_bankSessions',
  })
  bank_sessions: BankSessionsEntity[];

  @HasMany(() => BasketItemsEntity, {
    sourceKey: 'id',
    as: 'basket_basketItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  basket_items: BasketItemsEntity[];

  @BelongsTo(() => UserModel, {
    foreignKey: 'fk_user_id',
    targetKey: 'id',
    as: 'user_basket',
  })
  user: UserModel;
}
