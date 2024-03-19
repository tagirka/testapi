import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

import { AcquiringEnum } from '../types/request.types';

export class StatusSessionDto {
  @ApiProperty({
    example: '1',
    description: 'Acquiring Id',
  })
  @IsNumber()
  acquiringId: AcquiringEnum;

  @ApiProperty({
    example: 'agfs63267qyh232',
    description: 'Order Id',
  })
  @IsString()
  @IsOptional()
  orderId: string;
}
