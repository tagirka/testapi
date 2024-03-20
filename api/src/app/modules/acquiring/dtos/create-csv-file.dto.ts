import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCsvFileDto {
  @ApiProperty({
    example: 'file.txt',
    description: 'Имя транзакционного файла, записанного в .in',
  })
  @IsString({ message: 'Должно быть в строковом формате' })
  fileName: string;
}
