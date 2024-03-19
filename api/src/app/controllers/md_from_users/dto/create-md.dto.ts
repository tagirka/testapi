import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateMD_Dto {
  @ApiProperty({
    example: '12345',
    description: 'ID строки прибора',
  })
  @IsInt({ message: 'The value [id] must be an integer' })
  id: number;

  @ApiProperty({
    example: '12345',
    description: 'Последнее показание счетчика',
  })
  @IsNumber()
  volume: number;
}

/* 
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
  
  
  @ApiProperty({
    example: 'Дата',
    description: 'Дата снятия показаний по клиенту.',
  })
  @IsDateString() //{ message: 'Должно быть дата' })
  date_meter_reading: Date;

  @ApiProperty({
    example: 'Дата',
    description: 'Дата внесения показаний в систему.',
  })
  @IsDateString() //{ message: 'Должно быть дата' })
  date_entering: Date; 
  
  
  @ApiProperty({
    example: '12345',
    description: 'ID строки прибора',
  })
  @IsInt({ message: 'The value [id] must be an integer' })
  id: number;
  
  
  */
