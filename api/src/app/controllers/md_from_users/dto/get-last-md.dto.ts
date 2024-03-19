import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class GetLastMD_Dto {
  @ApiProperty({
    example: '12345',
    description: 'ID ЕЛС (единный лицевой счет)',
  })
  @IsInt({ message: 'The value [els_id] must be an integer' })
  els_id: number;

  @ApiProperty({
    example: '12345',
    description: 'ID услуги)',
  })
  @IsInt({ message: 'The value [service_id] must be an integer' })
  service_id: number;
}
