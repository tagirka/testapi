import {
  CreatedAt,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  Index,
  UpdatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

import { ElsEntity } from '../../els/entities/els.entity';
import { CompanyEntity } from '../../company/entities/company.entity';
import { MeasureEntity } from '../../measure/entities/measure.entity';
import { SN_Of_MeterEntity } from '../../sn_of_meter/entities/sn_of_meter.entity';
import { TariffEntity } from '../../tariff/entities/tariff.entity';
import { Make_Of_MeterEntity } from '../../make_of_meter/entities/make_of_meter.entity';
import { Make_Of_ServiceEntity } from '../../make_of_service/entities/make_of_service.entity';
import { MD_From_UsersEntity } from '@webapi/app/modules/md_from_users/entities/md_from_users.entity';

export interface Imeters_dataCreationAttrs {
  fk_els_id: number;
  date_previous_period: number; //date_pu: string;
  volume_previous_period: number; //volume: string;
  source_previous_reading: string; //vol_type: string;
  date_pre_previous_period: number; //date_pu_pr: string;
  volume_pre_previous_period: number; //volume_pr: string;
  date_current_period: number; //date_pu_cur: string;
  volume_current_period: number; //volume_cur: string;
  source_current_period: string; //vol_type_cur: string;
  max_daily_volume: number; //vol_max_daily: string;
  fk_make_of_meter_id: number; //pu_type: string;
  volume_common_house: number; //vol_house: string;
  individual_volume_in_house: number; //vol_individ: string;
  fk_service_id: number; //code_sus: string;
  fk_company_id: number; //code_so: string;
  code_payee: string; //code_pp: string;
  code_data_owner: string; //code_do: string;
  additional_parameter_code1: string; //code_dp: string;
  additional_parameter_code2: string; //code_dp2: string;
  additional_parameter_code3: string; //code_dp3: string;
  additional_parameter1: string; //name_dp: string;
  additional_parameter2: string; //name_dp2: string;
  additional_parameter3: string; //name_dp3: string;
  billing_year: number; //ryear: string;
  billing_month: number; //rmonth: string;
  exchange_code: string;
  fk_sn_of_meter_id: number; //device_number: string;
  acode_id: string; //device_numberz: string;
  date_check: number; //datecheck: string;
  date_next_check: number; //datenextcheck: string;
  date_closing: number; //dateclose: string;
  scoreboard_meter: number; //vol_max_length: string;
  transformation_ratio: number; //kt: string;
  loss_percentage: number; //loss: string;
  scale_id: string;
  fk_measure_id: number; //measure: string;
  fk_tariff_id: number;
}

@Table({ tableName: 'meters_data', timestamps: true })
export class Meters_DataEntity extends Model<
  Meters_DataEntity,
  Imeters_dataCreationAttrs
> {
  // @Index("payment_els_index")

  @ApiProperty({ example: '001', description: 'ID' })
  @Column({
    type: DataType.BIGINT,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @ApiProperty({
    example: '7406070809',
    description: 'Единый лицевой счет (ЕЛС)',
  })
  @Index('md_els_index')
  @ForeignKey(() => ElsEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_els_id: number;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата предыдущих показаний по прибору учёта',
  })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  date_previous_period: number; //date_pu: string;

  @ApiProperty({
    example: 'Вещественный',
    description: 'Показания на начало периода',
  })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  volume_previous_period: number; //volume: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Источник показаний на начало периода',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  source_previous_reading: string; //vol_type: string;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата показаний за период, предшествующий предыдущему',
  })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  date_pre_previous_period: number; //date_pu_pr: string;

  @ApiProperty({
    example: 'Вещественный',
    description:
      'Объём потреблённой услуги согласно периоду, предшествующий предыдущему',
  })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  volume_pre_previous_period: number; //volume_pr: string;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата передачи показаний за указанный расчётный период',
  })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  date_current_period: number; //date_pu_cur: string;

  @ApiProperty({ example: 'Вещественный', description: 'Текущие показания' })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  volume_current_period: number; //volume_cur: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Источник показаний за указанный расчётный период',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  source_current_period: string; //vol_type_cur: string;

  @ApiProperty({
    example: 'Вещественный',
    description:
      'Максимальный среднесуточный расход для проверки введенных показаний',
  })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  max_daily_volume: number; //vol_max_daily: string;

  @ApiProperty({ example: 'Общеквартирный', description: 'Тип счетчика' })
  @ForeignKey(() => Make_Of_MeterEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_make_of_meter_id: number; //pu_type: string;

  @ApiProperty({
    example: 'Вещественный',
    description: 'Общий объём на общедомовые нужды',
  })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  volume_common_house: number; //vol_house: string;

  @ApiProperty({
    example: 'Вещественный',
    description: 'Объём индивидуальный в доме',
  })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  individual_volume_in_house: number; //vol_individ: string;

  @ApiProperty({ example: 'Строка', description: 'Код услуги' })
  @ForeignKey(() => Make_Of_ServiceEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_service_id: number; //code_sus: string;

  @ApiProperty({ example: 'Строка', description: 'Код поставщика по услуге' })
  @ForeignKey(() => CompanyEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_company_id: number; //code_so: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Код получателя платежа по услуге',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  code_payee: string; //code_pp: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Код организации - владельца данных',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  code_data_owner: string; //code_do: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Код  дополнительного параметра 1 (зависит от поставщика)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  additional_parameter_code1: string; //code_dp: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Код  дополнительного параметра 2 (зависит от поставщика)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  additional_parameter_code2: string; //code_dp2: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Код  дополнительного параметра 3 (зависит от поставщика)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  additional_parameter_code3: string; //code_dp3: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Дополнительный параметр 1 (зависит от поставщика)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  additional_parameter1: string; //name_dp: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Дополнительный параметр 2 (зависит от поставщика)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  additional_parameter2: string; //name_dp2: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Дополнительный параметр 3 (зависит от поставщика)',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  additional_parameter3: string; //name_dp3: string;

  @ApiProperty({ example: 'Строка (4) символа', description: 'Расчётный год' })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  billing_year: number; //ryear: string;

  @ApiProperty({
    example: 'Строка (2) символа',
    description: 'Расчётный месяц',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  billing_month: number; //rmonth: string;

  @ApiProperty({
    example: 'Строка (300)',
    description: 'Уникальный код, идентифицирующий прибор учёта клиента',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  exchange_code: string;

  @ApiProperty({
    example: 'Строка',
    description: 'Cерийный номер прибора учёта',
  })
  @ForeignKey(() => SN_Of_MeterEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_sn_of_meter_id: number; //device_number: string;

  @ApiProperty({ example: 'Строка', description: 'Дата поверки' })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  acode_id: string; //device_numberz: string;

  @ApiProperty({ example: 'Дата', description: 'Дата поверки' })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  date_check: number; //datecheck: string;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата следующей госповерки',
  })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  date_next_check: number; //datenextcheck: string;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата снятия прибора учета',
  })
  @Column({ type: DataType.DATEONLY, unique: false, allowNull: true })
  date_closing: number; //dateclose: string;

  @ApiProperty({
    example: 'Целый',
    description: 'Максимальное количество цифр в показании',
  })
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  scoreboard_meter: number; //vol_max_length: string;

  @ApiProperty({
    example: 'Вещественный',
    description: 'Коэффициент трансформации',
  })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  transformation_ratio: number; //kt: string;

  @ApiProperty({ example: 'Вещественный', description: 'Процент потерь' })
  @Column({ type: DataType.DECIMAL(12, 3), unique: false, allowNull: true })
  loss_percentage: number; //loss: string;

  @ApiProperty({
    example: 'Строка',
    description:
      'Идентификатор шкалы из биллинга. Если не указано, то значение берется равным EXCHANGE_CODE.',
  })
  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  scale_id: string;

  @ApiProperty({ example: 'ID', description: 'Единица измерения' })
  @ForeignKey(() => MeasureEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_measure_id: number; //measure: string;

  @ApiProperty({
    example: 'ID',
    description: 'Тариф по услуге для предварительного расчета задолженности',
  })
  @ForeignKey(() => TariffEntity)
  @Column({ type: DataType.INTEGER, unique: false, allowNull: true })
  fk_tariff_id: number; //tariff: string;

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

  @HasMany(() => MD_From_UsersEntity, {
    sourceKey: 'id',
    as: 'meters_data_md_users',
  })
  md_users: MD_From_UsersEntity[];

  @BelongsTo(() => ElsEntity, {
    foreignKey: 'fk_els_id',
    targetKey: 'id',
    as: 'els_meter',
  })
  els: ElsEntity;

  @BelongsTo(() => Make_Of_MeterEntity, {
    foreignKey: 'fk_make_of_meter_id',
    targetKey: 'id',
    as: 'type_meter',
  })
  type_meter: Make_Of_MeterEntity;

  @BelongsTo(() => SN_Of_MeterEntity, {
    foreignKey: 'fk_sn_of_meter_id',
    targetKey: 'id',
    as: 'sn_meters',
  })
  sn_of_meter: SN_Of_MeterEntity;

  @BelongsTo(() => Make_Of_ServiceEntity, {
    foreignKey: 'fk_service_id',
    targetKey: 'id',
    as: 'service_meter',
  })
  service: Make_Of_ServiceEntity;

  @BelongsTo(() => CompanyEntity, {
    foreignKey: 'fk_company_id',
    targetKey: 'id',
    as: 'company_meter',
  })
  company: CompanyEntity;

  @BelongsTo(() => MeasureEntity, {
    foreignKey: 'fk_measure_id',
    targetKey: 'id',
    as: 'measure_meter',
  })
  measure: MeasureEntity;

  @BelongsTo(() => TariffEntity, {
    foreignKey: 'fk_tariff_id',
    targetKey: 'id',
    as: 'tariff_meter',
  })
  tariff: TariffEntity;
}
