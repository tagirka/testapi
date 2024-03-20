import {
  HasMany,
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { BankSessionsEntity } from './bank_sessions.entity';

export interface IAcquiringCreationAttrs {
  name: string;
  address: string;
  requisites: string;
  url_start_session: string;
  url_status_session: string;
  login: string;
  password: string;
}

@Table({ tableName: 'acquiring', timestamps: true })
export class AcquiringEntity extends Model<
  AcquiringEntity,
  IAcquiringCreationAttrs
> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Bank Raiffeisen', description: 'Наименование' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  name: string;

  @ApiProperty({ example: 'г.Челябинск, пр.Ленина, 21', description: 'Адрес' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  address: string;

  @ApiProperty({
    example: 'ИНН 740012345, БИК 74653421, ...',
    description: 'Реквизиты',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  requisites: string;

  @ApiProperty({
    example: 'https://3dsec.sberbank.ru/payment/rest/register.do',
    description: 'Адрес API (register.do)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  url_start_session: string;

  @ApiProperty({
    example: 'https://3dsec.sberbank.ru/payment/rest/getOrderStatusExtended.do',
    description: 'Адрес API (getOrderStatusExtended.do)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  url_status_session: string;

  @ApiProperty({
    example: 'user',
    description: 'Логин',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  login: string;

  @ApiProperty({
    example: 'qwerty',
    description: 'Пароль',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  password: string;

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
    as: 'acquiring_bank_sessions',
  })
  bank_sessions: BankSessionsEntity[];
}
