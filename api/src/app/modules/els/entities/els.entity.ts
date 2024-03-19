import {
  BelongsTo,
  BelongsToMany,
  CreatedAt,
  ForeignKey,
  HasMany,
  Column,
  DataType,
  Model,
  Table,
  Index,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { AccountEntity } from '../../account/entities/account.entity';
import { UserModel } from '@webapi/app/controllers/auth/user/models/user.model';
import { BuildEntity } from '@webapi/app/modules/els/entities/build.entity';
import { MD_From_UsersEntity } from '@webapi/app/controllers/md_from_users/entities/md_from_users.entity';
import { Meters_DataEntity } from '../../meters_data/entities/meters_data.entity';
import { OperationEntity } from '../../operation/entities/operation.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { UserElsModel } from '@webapi/app/controllers/auth/user/models/user-els.model';
import { NamingEntity } from '@webapi/app/modules/els/entities/naming.entity';

export interface IelsCreationAttrs {
  els: string;
  fk_naming_id: number;
  fk_build_id: number;
  sq_live: number;
  l_count: number;
  house_type: number;
}

@Table({ tableName: 'els', timestamps: true })
export class ElsEntity extends Model<ElsEntity, IelsCreationAttrs> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: '7406050401',
    description: 'Единный лицевой счет (ЕЛС)',
  })
  @Index('els_index')
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    primaryKey: false,
  })
  els: string;

  @ForeignKey(() => NamingEntity)
  @ApiProperty({ example: '12345', description: 'id Naming' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_naming_id: number;

  @ForeignKey(() => BuildEntity)
  @ApiProperty({ example: '12345', description: 'id Build' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_build_id: number;

  @ApiProperty({ example: '123.45', description: 'Жилая площадь' })
  @Column({ type: DataType.DECIMAL(12, 2), unique: false, allowNull: true })
  sq_live: number;

  @ApiProperty({ example: '123', description: 'Количество проживающих' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  l_count: number;

  @ApiProperty({
    example: '123',
    description:
      'Тип помещения: 1 – Многоквартирный жилой фонд; 2 – Индивидуальный жилой фонд.',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  house_type: number;

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

  @BelongsTo(() => NamingEntity, {
    foreignKey: 'fk_naming_id',
    targetKey: 'id',
    as: 'naming_els',
  })
  naming: NamingEntity;

  @BelongsTo(() => BuildEntity, {
    foreignKey: 'fk_build_id',
    targetKey: 'id',
    as: 'build_els',
  })
  build: BuildEntity;

  @BelongsToMany(() => UserModel, () => UserElsModel)
  user: UserModel[];

  @HasMany(() => Meters_DataEntity, {
    sourceKey: 'id',
    as: 'els_meter',
  })
  meters_data: Meters_DataEntity[];

  @HasMany(() => OperationEntity, {
    sourceKey: 'id',
    as: 'operation_els',
  })
  operations: OperationEntity[];

  @HasMany(() => PaymentEntity, {
    sourceKey: 'id',
    as: 'payment_els',
  })
  payment: PaymentEntity[];

  @HasMany(() => AccountEntity, {
    sourceKey: 'id',
    as: 'els_account',
  })
  account: AccountEntity[];

  @HasMany(() => MD_From_UsersEntity, {
    sourceKey: 'id',
    as: 'els_md_users',
  })
  md_users: MD_From_UsersEntity[];
}
