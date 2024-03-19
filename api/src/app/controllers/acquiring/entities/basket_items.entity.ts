import {
  BelongsTo,
  CreatedAt,
  ForeignKey,
  Column,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { BasketEntity } from './basket.entity';
import { OperationEntity } from '@webapi/app/modules/operation/entities/operation.entity';

export interface IBasketItemsCreationAttrs {
  id?: bigint;
  fk_basket_id?: bigint;
  fk_operation_id: bigint;
  positionId: number;
  sum: number;
}

@Table({ tableName: 'basket_items', timestamps: true })
export class BasketItemsEntity extends Model<
  BasketItemsEntity,
  IBasketItemsCreationAttrs
> {
  @ApiProperty({ example: '1234', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  //@Index('basket_index')
  @ForeignKey(() => BasketEntity)
  @ApiProperty({ example: '12345', description: 'Basket ID' })
  @Column({ type: DataType.BIGINT, unique: false, allowNull: false })
  fk_basket_id: bigint;

  @ForeignKey(() => OperationEntity)
  @ApiProperty({ example: '12345', description: 'Operation ID' })
  @Column({ type: DataType.BIGINT, unique: false, allowNull: false })
  fk_operation_id: bigint;

  @ApiProperty({ example: '12345', description: 'Номер позиции в корзине.' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  positionId: number;

  @ApiProperty({ example: '12345', description: 'Сумма покупки в копейках.' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  sum: number;

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

  @BelongsTo(() => BasketEntity, {
    foreignKey: 'fk_basket_id',
    targetKey: 'id',
    as: 'basket_basketItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  basket: BasketEntity;

  @BelongsTo(() => OperationEntity, {
    foreignKey: 'fk_operation_id',
    targetKey: 'id',
    as: 'operation_basketItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  operation: OperationEntity;
}
