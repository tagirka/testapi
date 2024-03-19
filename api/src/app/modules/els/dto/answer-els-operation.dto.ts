import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

/* export class CreateElsDto {
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
} */

export class AswerElsOperationDto {
  id: number;
  @ApiProperty({
    example: "7406070809",
    description: "ЕЛС (единный лицевой счет)",
  })
  els: string;
  @ApiProperty({
    example: "[]",
    description: "Operation",
  })
  operation_els_id: [
    {
      id: number;
      els_id: number;
      service_id: number;
      company_id: number;
      billing_year: number;
      billing_month: number;
      sum_z: number;
      sum_opl: number;
      sum_nach: number;
      sum_reras: number;
      sum_final: number;
      volume: number;
      measure: string;
      tarif: number;
      operation_service: {
        id: number;
        code_sus: string;
        name_us: string;
      };
      operation_company: {
        id: number;
        code: string;
        name: string;
        inn: string;
        address: string;
        priority: number;
        guid_so: string;
        phone: string;
      };
      operate_payment_id: [
        {
          id: number;
          fk_els_id: number;
          service_id: number;
          company_id: number;
          code_so: string;
          sum_opl: number;
          date_opl: string;
          type_opl: string;
          billing_year: number;
          billing_month: number;
          doc_num: string;
          pay_num: string;
        }
      ];
    }
  ];
  user: {
    id: number;
    short_name: string;
    fk_auth_id: number;
    fk_els_id: number;
    fk_user_property_id: number;
  };
  user_property: {
    id: number;
    last_name: string;
    first_name: string;
    patronymic: string;
    passport: string;
    address: string;
    fk_els_id: number;
  };
}
