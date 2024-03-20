import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { AcquiringEntity } from './acquiring.entity';
import { BasketEntity } from './basket.entity';
import { UserModel } from '@webapi/app/controllers/auth/user/models/user.model';

export interface IBankSessionsCreationAttrs {
  id?: bigint;
  fk_acquiring_id: number;
  fk_user_id: number;
  fk_basket_id?: bigint;
  date_order: Date;
  amount: number;
  url_forward?: string;
  url_error?: string;
  url_payment?: string;
  order_id?: string;
  error_code?: number;
  status?: number;
  action_code?: number;
  user_ip?: string;
}

export interface IBankSessionsUpdateAttrs {
  fk_acquiring_id?: number;
  fk_user_id?: number;
  fk_basket_id?: bigint;
  date_order?: Date;
  amount?: number;
  url_forward?: string;
  url_error?: string;
  url_payment?: string;
  order_id?: string;
  error_code?: number;
  status?: number;
  action_code?: number;
  user_ip?: string;
}

@Table({ tableName: 'bank_sessions', timestamps: true })
export class BankSessionsEntity extends Model<
  BankSessionsEntity,
  IBankSessionsCreationAttrs
> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @ForeignKey(() => AcquiringEntity)
  @ApiProperty({ example: '123', description: 'Acquiring ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: false })
  fk_acquiring_id: number;

  @ForeignKey(() => UserModel)
  @ApiProperty({ example: '123', description: 'User ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: false })
  fk_user_id: number;

  @ForeignKey(() => BasketEntity)
  @ApiProperty({ example: '123', description: 'Basket ID' })
  @Column({ type: DataType.BIGINT, unique: false, allowNull: true })
  fk_basket_id: bigint;

  @ApiProperty({ example: '01.01.2024', description: 'Дата запроса на оплату' })
  @Column({ type: DataType.DATE, unique: false, allowNull: false })
  date_order: Date;

  @ApiProperty({
    example: '12345',
    description: 'Сумма запроса на оплату, в копейках',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: false })
  amount: number;

  @ApiProperty({
    example: 'https://forward.ru',
    description:
      'Адрес, на который требуется перенаправить пользователя в случае успешной оплаты.',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  url_forward: string;

  @ApiProperty({
    example: 'https://error.ru',
    description:
      'Адрес, на который требуется перенаправить пользователя в случае неуспешной оплаты.',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  url_error: string;

  @ApiProperty({
    example: 'https://pay.ru',
    description:
      'Адрес платежной формы, на которую будет перенаправлен покупатель.',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  url_payment: string;

  @ApiProperty({
    example: '81cfb742-e53b-7644-b292-bc7500c43a61',
    description: 'Номер заказа в платежном шлюзе.',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  order_id: string;

  @ApiProperty({
    example: '0',
    description: 'Информационный параметр в случае ошибки.',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  error_code: number;

  @ApiProperty({
    example: '1',
    description: 'Указывает статус заказа в платежном шлюзе.',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  status: number;

  @ApiProperty({
    example: '2',
    description: 'Код ответа от процессинга банка.',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  action_code: number;

  @ApiProperty({
    example: '172.10.20.1',
    description: 'IP адрес плательщика.',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  user_ip: string;

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

  @BelongsTo(() => AcquiringEntity, {
    foreignKey: 'fk_acquiring_id',
    targetKey: 'id',
    as: 'acquiring_bank_sessions',
  })
  acquiring: AcquiringEntity;

  @BelongsTo(() => UserModel, {
    foreignKey: 'fk_user_id',
    targetKey: 'id',
    as: 'user_bankSessions',
  })
  user: UserModel;

  @BelongsTo(() => BasketEntity, {
    foreignKey: 'fk_basket_id',
    targetKey: 'id',
    as: 'basket_bankSessions',
  })
  basket: BasketEntity;
}
