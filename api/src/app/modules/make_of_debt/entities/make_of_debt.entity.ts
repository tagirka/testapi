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

import { OperationEntity } from '../../operation/entities/operation.entity';

export interface Imake_of_debtCreationAttrs {
  title: string;
}

@Table({ tableName: 'make_of_debt', timestamps: true })
export class Make_Of_DebtEntity extends Model<
  Make_Of_DebtEntity,
  Imake_of_debtCreationAttrs
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
    as: 'make_of_debt_operation',
  })
  operations: OperationEntity[];
}
