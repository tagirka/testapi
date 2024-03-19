import { HasMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { ElsEntity } from './els.entity';

export interface IbuildCreationAttrs {
  address_string: string;
}

@Table({ tableName: 'build', timestamps: false })
export class BuildEntity extends Model<BuildEntity, IbuildCreationAttrs> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'г.Челябинск, пр.Ленина, 21', description: 'Адрес' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  address_string: string;

  @HasMany(() => ElsEntity, {
    sourceKey: 'id',
    as: 'build_els',
  })
  els: ElsEntity[];
}
