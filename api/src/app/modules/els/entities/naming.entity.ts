import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { ElsEntity } from '@webapi/app/modules/els/entities/els.entity';

export interface InamingCreationAttrs {
  short_name: string;
  last_name: string;
  first_name: string;
  patronymic: string;
}

@Table({ tableName: 'naming', timestamps: false })
export class NamingEntity extends Model<NamingEntity, InamingCreationAttrs> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Ivan32', description: 'Короткое имя (алиас)' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  short_name: string;

  @ApiProperty({ example: 'Петров', description: 'Фамилия' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  last_name: string;

  @ApiProperty({ example: 'Иван', description: 'Имя' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  first_name: string;

  @ApiProperty({ example: 'Сергеевич', description: 'Отчество' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  patronymic: string;

  @HasMany(() => ElsEntity, {
    sourceKey: 'id',
    as: 'naming_els',
  })
  els: ElsEntity[];
}
