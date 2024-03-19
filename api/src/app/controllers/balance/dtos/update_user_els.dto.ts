import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateUserElsDto {
  @ApiProperty({
    example: '7400123456',
    description: 'Els. Cтрока.',
  })
  @IsString({ message: 'The value [id] must be an integer' })
  els: string;
}
