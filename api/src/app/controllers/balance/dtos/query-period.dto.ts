import { ApiProperty } from '@nestjs/swagger';
import { toNumber } from '@webapi/libs/utils/helpers/number-options';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class QueryPeriodDto {
  @ApiProperty({
    example: '2023',
    description: 'Начало периода. Год.',
  })
  @Transform(({ value }) =>
    toNumber(value, {
      default: new Date().getFullYear(),
      min: 2023,
      max: new Date().getFullYear(),
    })
  )
  @IsNumber()
  @IsOptional()
  startyear: number = new Date().getFullYear();

  @ApiProperty({
    example: '10',
    description: 'Начало периода. Месяц.',
  })
  @Transform(({ value }) =>
    toNumber(value, {
      default: new Date().getMonth(),
      min: 0,
      max: 11,
    })
  )
  @IsOptional()
  @IsNumber()
  startmonth = new Date().getMonth();

  @ApiProperty({
    example: '2023',
    description: 'Конец периода. Год.',
  })
  @Transform(({ value }) =>
    toNumber(value, {
      default: new Date().getFullYear(),
      min: 2023,
      max: new Date().getFullYear(),
    })
  )
  @IsNumber()
  @IsOptional()
  endyear: number = new Date().getFullYear();

  @ApiProperty({
    example: '11',
    description: 'Конец периода. Месяц.',
  })
  @Transform(({ value }) =>
    toNumber(value, { default: new Date().getMonth(), min: 0, max: 11 })
  )
  @IsNumber()
  @IsOptional()
  endmonth = new Date().getMonth();
}
