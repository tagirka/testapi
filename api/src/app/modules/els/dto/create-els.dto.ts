import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateElsDto {
  @ApiProperty({
    example: "1234567890",
    description: "ЕЛС (единный лицевой счет)",
  })
  @IsString({ message: "Должно быть строкой" })
  @Length(10, 10, { message: "Длина 10 символов" })
  readonly els: string;
  @ApiProperty({ example: "Объект по адресу....", description: "Адрес" })
  @IsString({ message: "Должно быть строкой" })
  readonly address: string;
}
