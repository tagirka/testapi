import {
  CreatedAt,
  HasOne,
  Column,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

export interface IproviderCreationAttrs {
  fk_company_id: bigint;
}

@Table({ tableName: 'provider', timestamps: true })
export class ProviderEntity extends Model<
  ProviderEntity,
  IproviderCreationAttrs
> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  //@ForeignKey(() => CompanyEntity)
  @ApiProperty({ example: '1234', description: 'Company ID' })
  @Column({ type: DataType.INTEGER, unique: true, allowNull: true })
  fk_company_id: number;

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

  /* @HasOne(() => NamingEntity)
  user: NamingEntity; */

  //@BelongsTo(() => NamingEntity) { foreignKey: 'idClient' }
  //persona: NamingEntity;
}
