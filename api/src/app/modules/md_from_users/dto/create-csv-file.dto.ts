import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateCsvFileMD_Dto {
  @ApiProperty({
    example: '01.01.2023',
    description: 'Дата внесения показаний',
  })
  //@IsDateString() //{ message: 'Должно быть в формате даты' })
  @IsString({ message: 'Должно быть в строковом формате' })
  date_entry: string;
}
