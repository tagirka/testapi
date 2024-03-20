import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMobilePhone,
  Min,
  IsNumber,
  MinLength,
  IsDataURI,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { AcquiringEnum } from '../types/request.types';

/* class BasketItem {
  @IsNumber()
  @Min(1)
  operationId: bigint;

  @IsNumber()
  @Min(1)
  sum: number; @IsMobilePhone(locale: string) @IsPhoneNumber(region: string) @IsNumberString(options?: IsNumericOptions) 
} */

export class StartSessionDto {
  @ApiProperty({
    example: 'localhost:80',
    description: 'Базовый URL.',
  })
  //@IsDataURI()
  @IsString()
  // @MinLength(9)
  baseUrl?: string;

  @ApiProperty({
    example: '99',
    description: 'Id экваринга.',
  })
  @IsNumber()
  //@Min(1)
  //@Max(1)
  acquiringId: AcquiringEnum;

  // @ApiProperty({
  //   example: '99',
  //   description: 'Id клиента.',
  // })
  // @IsNumber()
  // @Min(1)
  // userId: number;

  @ApiProperty({
    example: '10',
    description: 'Номер телефона',
  })
  @ValidateIf((o) => o.acquiringId === AcquiringEnum.SB_PAY)
  @IsString({ message: 'Должно быть строкой' })
  @Length(7, 15, { message: 'Не меньше 7 и не больше 15' })
  @IsMobilePhone()
  phone?: string; // @IsMobilePhone(locale: string) @IsPhoneNumber(region: string) @IsNumberString(options?: IsNumericOptions)

  @ApiProperty({
    example: '9999',
    description: 'Итогова сумма по корзине, в копейках.',
  })
  @IsNumber()
  // @Min(1)
  totalSum: number; //amount

  @ApiProperty({
    example: '[{positionId: 1, operationId: 99, sum: 9999}]',
    description: 'Массив из элементов корзины [{operationId: 99, sum: 9999}].',
  })
  //@ValidateNested()
  @IsArray()
  basketItems: {
    positionId: number;
    operationId: bigint;
    sum: number;
  }[];
}
