import {
  CreatedAt,
  BelongsTo,
  ForeignKey,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  Index,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { AccountEntity } from '../../account/entities/account.entity';
import { CompanyEntity } from '../../company/entities/company.entity';
import { MD_From_UsersEntity } from '@webapi/app/controllers/md_from_users/entities/md_from_users.entity';
import { Meters_DataEntity } from '../../meters_data/entities/meters_data.entity';
import { OperationEntity } from '../../operation/entities/operation.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { TariffEntity } from '../../tariff/entities/tariff.entity';
import { ServiceTypeEnum } from '@webapi/libs/interfaces';

export interface Imake_of_serviceCreationAttrs {
  fk_company_id: number;
  code_sus: string;
  name_us: string;
  service_type: string;
}

@Table({ tableName: 'make_of_service', timestamps: true })
export class Make_Of_ServiceEntity extends Model<
  Make_Of_ServiceEntity,
  Imake_of_serviceCreationAttrs
> {
  @ApiProperty({ example: '001', description: 'ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => CompanyEntity)
  @ApiProperty({ example: '123', description: 'Company ID' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_company_id: number;

  @ApiProperty({ example: '004_300', description: 'Код услуги' })
  @Index('codesus_index')
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    primaryKey: false,
  })
  code_sus: string;

  @ApiProperty({ example: 'Отопление', description: 'Наименование услуги' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  name_us: string;

  @ApiProperty({ example: 'SERVICE', description: 'Тип услуги' })
  @Column({
    type: DataType.STRING,
    defaultValue: ServiceTypeEnum.SERVICE,
    unique: false,
    allowNull: false,
  })
  service_type: string;

  @ApiProperty({ example: '2', description: 'Кол-во знаков после запятой' })
  @Column({
    type: DataType.INTEGER,
    defaultValue: 2,
    unique: false,
    allowNull: false,
  })
  decimal_places: number;

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
    as: 'service_meter',
  })
  meters_data: Meters_DataEntity[];

  @HasMany(() => OperationEntity, {
    sourceKey: 'id',
    as: 'operation_service',
  })
  operations: OperationEntity[];

  @HasMany(() => PaymentEntity, {
    sourceKey: 'id',
    as: 'payment_service',
  })
  payments: PaymentEntity[];

  @HasMany(() => AccountEntity, {
    sourceKey: 'id',
    as: 'service_account',
  })
  accounts: AccountEntity[];

  @HasMany(() => TariffEntity, {
    sourceKey: 'id',
    as: 'service_tariff',
  })
  tariffs: TariffEntity[];

  @HasMany(() => MD_From_UsersEntity, {
    sourceKey: 'id',
    as: 'service_md_users',
  })
  md_users: MD_From_UsersEntity[];

  @BelongsTo(() => CompanyEntity, {
    targetKey: 'id',
    as: 'company_service',
  })
  company: CompanyEntity;
}
